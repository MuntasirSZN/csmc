import { remarkImage } from 'fumadocs-core/mdx-plugins'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import rehypeCallouts from 'rehype-callouts'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import remarkMath from 'remark-math'

export const blogs = defineDocs({
  dir: 'blogs',
})

export const contests = defineDocs({
  dir: 'contests',
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkImage],
    rehypePlugins: v => [rehypeKatex, rehypeMermaid, rehypeCallouts, ...v],
  },
})
