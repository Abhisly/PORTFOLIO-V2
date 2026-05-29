import * as THREE from 'three'
import { PARUL_LOGO_BASE64 } from './logoBase64'

/** Strap texture — black, just "PARUL UNIVERSITY" text */
export function createStrapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  // Black background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // White text — larger font and spaced out letters
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Add letter spacing via ctx.letterSpacing (modern browsers)
  ;(ctx as any).letterSpacing = '8px'
  ctx.fillText('PARUL UNIVERSITY', canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  texture.anisotropy = 16
  texture.needsUpdate = true
  return texture
}


function makeTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  // flipY = true is the default for canvas textures and is correct for GLB UV coords
  tex.flipY = true
  tex.anisotropy = 16
  tex.needsUpdate = true
  return tex
}

/** Plain white card — shown instantly before logo loads */
export function createCardTexture(): THREE.CanvasTexture {
  const W = 1024, H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  return makeTexture(canvas)
}

/**
 * Loads the Parul logo from base64 and returns a THREE.Texture.
 * This texture is applied to a dedicated plane mesh placed on the card front face,
 * which completely avoids GLB UV mapping issues (no mirroring, no offset).
 */
export function loadLogoTexture(): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const tex = new THREE.Texture(img)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      resolve(tex)
    }
    img.onerror = () => resolve(new THREE.Texture())
    img.src = PARUL_LOGO_BASE64
  })
}

/**
 * Loads the back image, scales it to cover the canvas, and applies rounded corners
 * so it perfectly fits the shape of the card on a plane geometry.
 */
export function loadBackImageTexture(): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const W = 1024, H = 1422 // Approximate card aspect ratio (0.711 / 1.0)
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Draw rounded rectangle path for clipping
    const radius = 64 // Adjust for card corner radius
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(W - radius, 0)
    ctx.quadraticCurveTo(W, 0, W, radius)
    ctx.lineTo(W, H - radius)
    ctx.quadraticCurveTo(W, H, W - radius, H)
    ctx.lineTo(radius, H)
    ctx.quadraticCurveTo(0, H, 0, H - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.clip()

    const img = new Image()
    img.onload = () => {
      // Cover logic (like object-fit: cover)
      const imgAspect = img.width / img.height
      const canvasAspect = W / H
      let drawW = W
      let drawH = H
      let offsetX = 0
      let offsetY = 0

      if (imgAspect > canvasAspect) {
        drawW = H * imgAspect
        offsetX = (W - drawW) / 2
      } else {
        drawH = W / imgAspect
        offsetY = (H - drawH) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
      resolve(makeTexture(canvas))
    }
    img.onerror = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)
      resolve(makeTexture(canvas))
    }
    img.src = '/back-image.jpg'
  })
}
