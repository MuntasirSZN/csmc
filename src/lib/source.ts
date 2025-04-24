import { blogs, contests } from '@/.source'
import { loader } from 'fumadocs-core/source'

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const blogs_source = loader({
  // it assigns a URL to your pages
  baseUrl: '/blogs',
  source: blogs.toFumadocsSource(),
})

export const contests_source = loader({
  // it assigns a URL to your pages
  baseUrl: '/contests',
  source: contests.toFumadocsSource(),
})
