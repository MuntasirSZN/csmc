import type { MetadataRoute  } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://csmc.vercel.app/sitemap.xml',
  }
}
