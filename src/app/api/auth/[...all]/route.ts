/*
 * The catch-all route for auth. Provides all auth related api
 * routes with ease.
 */

import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

export const { POST, GET } = toNextJsHandler(auth)
