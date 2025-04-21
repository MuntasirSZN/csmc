import type { PluginOptions } from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'
import process from 'node:process'
import withPWAInit from '@ducanh2912/next-pwa'
import { createMDX } from 'fumadocs-mdx/next'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
} satisfies PluginOptions)

const withMDX = createMDX()

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default withMDX(withPWA(nextConfig))
