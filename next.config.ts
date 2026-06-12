import type { NextConfig } from 'next'
import { withSerwist } from '@serwist/turbopack'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  turbopack: {},
  reactCompiler: true,
  reactStrictMode: true,
}

export default withSerwist(nextConfig)
