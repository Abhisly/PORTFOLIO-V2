/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  transpilePackages: [
    'three',
    'meshline',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/rapier',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/i,
      type: 'asset/resource',
    })

    if (isServer) {
      config.externals = [...(config.externals || []), '@react-three/rapier']
    }

    return config
  },
}

module.exports = nextConfig
