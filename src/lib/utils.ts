/*
 * Utilities used by app
 */

import { createCn } from 'cn/engine'

import tables from './cn-tables'

export const cn = createCn(tables)

export function convertSecondsToTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
