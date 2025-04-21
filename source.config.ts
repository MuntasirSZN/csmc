import { remarkImage } from 'fumadocs-core/mdx-plugins'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import rehypeCallouts from 'rehype-callouts'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import remarkMath from 'remark-math'

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'blogs',
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkImage],
    rehypePlugins: v => [rehypeKatex, rehypeCallouts, rehypeMermaid, ...v],
  },
})
