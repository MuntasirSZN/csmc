/*
 * The robots.txt generation is done here. With typescript code.
 */

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://collegiateschoolmathclub.netlify.app/sitemap.xml',
  }
}
