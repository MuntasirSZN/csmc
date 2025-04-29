import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Collegiate School Math Club',
    short_name: 'CSMC',
    description: 'Meet a new range of thinking with mathematics',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0A0C',
    theme_color: '#0B0A0C',
    icons: [
      {
        src: '/png-logos/CSMC.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
