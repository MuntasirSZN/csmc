/*
 * The catch-all route for auth. Provides all auth related api
 * routes with ease.
 */

import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
