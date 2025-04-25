import type { PluginOptions } from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
} satisfies PluginOptions)

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default withPWA(nextConfig)
