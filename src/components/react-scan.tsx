/*
 * Visualize rerendering in react
 */

'use client'

/* eslint-disable perfectionist/sort-imports */

// react-scan must be imported before react
import { scan } from 'react-scan'
import type { JSX } from 'react'
import { useEffect } from 'react'

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    })
  }, [])

  return <></>
}
