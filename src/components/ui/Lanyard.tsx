/* eslint-disable react/no-unknown-property */
'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

import { CARD_GLB } from '@/lib/lanyardPreload'
import { createCardTexture, createStrapTexture, loadLogoTexture, loadBackImageTexture } from '@/lib/lanyardCard'
import './Lanyard.css'

extend({ MeshLineGeometry, MeshLineMaterial } as any)

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  className?: string
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  className = '',
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const wrapperClass = ['lanyard-wrapper', className].filter(Boolean).join(' ')
  if (!mounted) return <div className={wrapperClass} aria-hidden />

  return (
    <div className={wrapperClass}>
      <Canvas
        frameloop="always"
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={1.2} />
        <hemisphereLight intensity={0.55} groundColor="#111111" color="#ffffff" />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <directionalLight position={[-4, 2, 3]} intensity={0.85} />
        <pointLight position={[0, 2, 8]} intensity={1.5} color="#ffffff" />

        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band isMobile={isMobile} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  )
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef<THREE.Mesh>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  // Scroll tracking for X-axis card rotation
  const scrollY = useRef(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }

  const gltf = useGLTF(CARD_GLB) as any
  const nodes = gltf?.nodes
  const materials = gltf?.materials

  const cardGeometry = nodes?.card?.geometry as THREE.BufferGeometry | undefined

  // Plain white card texture (always shown)
  const [cardTex] = useState<THREE.CanvasTexture>(() => createCardTexture())

  // Logo texture loaded separately and applied to a plane overlay
  const [logoTex, setLogoTex] = useState<THREE.Texture | null>(null)
  const [backTex, setBackTex] = useState<THREE.CanvasTexture | null>(null)
  const [dynamicStrapMap, setDynamicStrapMap] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    loadLogoTexture().then(setLogoTex)
    loadBackImageTexture().then(setBackTex)
  }, [])

  useEffect(() => {
    const tex = createStrapTexture()
    setDynamicStrapMap(tex)
    return () => tex.dispose()
  }, [])

  // Clear default GLB material maps
  useEffect(() => {
    if (!materials || typeof materials !== 'object') return
    Object.values(materials).forEach((mat: any) => {
      if (mat?.map) { mat.map = null; mat.needsUpdate = true }
    })
  }, [materials])

  const [curve] = useState(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3(), new THREE.Vector3(),
    ])
  )
  const [dragged, drag] = useState<false | THREE.Vector3>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => { document.body.style.cursor = 'auto' }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }

    if (!fixed.current || !band.current || !j3.current || !card.current) return

    ;[j1, j2].forEach((ref) => {
      if (!ref.current) return
      if (!ref.current.lerped)
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
      const dist = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
      ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + dist * (maxSpeed - minSpeed)))
    })

    if (j2.current?.lerped && j1.current?.lerped) {
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      ;(band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32))
    }

    ang.copy(card.current.angvel())
    rot.copy(card.current.rotation())

    // Scroll-driven Y-axis rotation: scroll down = card rotates backward
    const scrollDelta = scrollY.current - lastScrollY.current
    lastScrollY.current = scrollY.current
    const yAngularKick = scrollDelta * -0.04   // negative = backward rotation on scroll down

    card.current.setAngvel({
      x: ang.x,
      y: ang.y + yAngularKick - rot.y * 0.25,
      z: ang.z,
    })
  })

  // Compute card bounding box to find exact center of card face
  const cardCenter = useMemo(() => {
    if (!cardGeometry) return new THREE.Vector3(0, 0, 0)
    cardGeometry.computeBoundingBox()
    const center = new THREE.Vector3()
    cardGeometry.boundingBox?.getCenter(center)
    return center
  }, [cardGeometry])

  // Exact card dimensions for the back plane
  const cardDims = useMemo(() => {
    if (!cardGeometry) return { w: 0.711, h: 1.0 }
    cardGeometry.computeBoundingBox()
    const bb = cardGeometry.boundingBox!
    return {
      w: bb.max.x - bb.min.x,
      h: bb.max.y - bb.min.y,
    }
  }, [cardGeometry])

  // Logo aspect ratio: parul-university-logo.png is square (1080x1080)
  // Use the card width to determine logo size, keeping aspect 1:1
  const logoSize = useMemo(() => {
    // Use 72% of the smaller dimension so logo fits without stretching
    const side = Math.min(cardDims.w, cardDims.h) * 0.72
    return { w: side, h: side }
  }, [cardDims])

  curve.curveType = 'chordal'
  const metalMaterial = materials?.metal

  if (!cardGeometry || !nodes?.clip || !nodes?.clamp) return null

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* White card base using GLB geometry */}
            <mesh geometry={cardGeometry}>
              <meshPhysicalMaterial
                map={cardTex}
                roughness={0.45}
                metalness={0.05}
                clearcoat={isMobile ? 0 : 0.5}
                clearcoatRoughness={0.2}
              />
            </mesh>

            {/* Logo plane — centered on card face using bounding box, square to match logo 1:1 ratio */}
            {logoTex && (
              <mesh position={[cardCenter.x, cardCenter.y, cardCenter.z + 0.02]}>
                <planeGeometry args={[logoSize.w, logoSize.h]} />
                <meshBasicMaterial
                  map={logoTex}
                  transparent={true}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Backside image plane */}
            {backTex && (
              <mesh position={[cardCenter.x, cardCenter.y, cardCenter.z - 0.02]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[cardDims.w, cardDims.h]} />
                <meshBasicMaterial
                  map={backTex}
                  transparent={true}
                  depthWrite={false}
                />
              </mesh>
            )}

            {metalMaterial && (
              <>
                <mesh geometry={nodes.clip.geometry} material={metalMaterial} material-roughness={0.3} />
                <mesh geometry={nodes.clamp.geometry} material={metalMaterial} />
              </>
            )}
          </group>
        </RigidBody>
      </group>

      {dynamicStrapMap && (
        <mesh ref={band}>
          {/* @ts-expect-error extended via meshline */}
          <meshLineGeometry />
          {/* @ts-expect-error extended via meshline */}
          <meshLineMaterial
            color="#ffffff"
            depthTest={false}
            resolution={[2000, 2000]}
            useMap={true}
            map={dynamicStrapMap}
            repeat={[-3, 1]}
            lineWidth={1.8}
          />
        </mesh>
      )}
    </>
  )
}
