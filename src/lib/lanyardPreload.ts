export const CARD_GLB = '/card.glb'
export const PARUL_LOGO = '/parul-university-logo.png'
export const STRAP_TEXTURE = '/lanyard-strap.png'

let preloadPromise: Promise<void> | null = null

export function preloadLanyardAssets(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (preloadPromise) return preloadPromise

  preloadPromise = (async () => {
    await Promise.all([
      fetch(CARD_GLB, { cache: 'force-cache' }),
      fetch(PARUL_LOGO, { cache: 'force-cache' }),
      fetch(STRAP_TEXTURE, { cache: 'force-cache' }),
      import('@react-three/drei').then(({ useGLTF, useTexture }) => {
        useGLTF.preload(CARD_GLB)
        useTexture.preload(PARUL_LOGO)
        useTexture.preload(STRAP_TEXTURE)
      }),
    ])
  })().catch(() => {
    preloadPromise = null
  })

  return preloadPromise
}
