import rehypeCallouts from 'rehype-callouts'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'

export const remarkPlugins = [remarkRehype, remarkGfm, remarkMath]

export const rehypePlugins = [rehypeCallouts, rehypeKatex]
