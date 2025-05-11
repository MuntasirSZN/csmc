/*
 * Opengraph image, gets generated with code at build time.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const contentType = 'image/png'

export const size = {
  width: 1200,
  height: 630,
}

export const alt = 'Collegiate School Math Club'

export default async function OGImage() {
  const geistMedium = await readFile(
    join(process.cwd(), 'src/app/fonts/Geist-Medium.ttf'),
  )

  const logoData = await readFile(
    join(process.cwd(), 'public/png-logos/CSMC.png'),
  )

  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0d1a29 0%, #1a365d 50%, #2b6cb0 100%)',
          padding: '40px',
          fontFamily: '"Geist", sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            zIndex: 1,
            opacity: 0.4,
          }}
        >
          {/* Mathematical symbols background */}
          <div
            style={{
              position: 'absolute',
              fontSize: '42px',
              color: 'rgba(255, 255, 255, 0.15)',
              top: '5%',
              left: '8%',
              transform: 'rotate(-15deg)',
            }}
          >
            π
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '56px',
              color: 'rgba(255, 255, 255, 0.15)',
              top: '15%',
              right: '12%',
              transform: 'rotate(10deg)',
            }}
          >
            Σ
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '48px',
              color: 'rgba(255, 255, 255, 0.12)',
              bottom: '20%',
              left: '15%',
            }}
          >
            ∫
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '60px',
              color: 'rgba(255, 255, 255, 0.15)',
              bottom: '12%',
              right: '18%',
              transform: 'rotate(-5deg)',
            }}
          >
            e
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '52px',
              color: 'rgba(255, 255, 255, 0.12)',
              top: '50%',
              left: '20%',
              transform: 'rotate(5deg)',
            }}
          >
            √
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '46px',
              color: 'rgba(255, 255, 255, 0.15)',
              top: '40%',
              right: '22%',
              transform: 'rotate(-8deg)',
            }}
          >
            ∞
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            width: '100%',
            height: '100%',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Glow effect sphere */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(144,205,244,0.15) 0%, rgba(255,255,255,0) 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(30px)',
              zIndex: -1,
            }}
          />

          {/* Logo */}
          <img
            src={logoBase64}
            width={120}
            height={120}
            alt="CSMC Logo"
            style={{
              marginBottom: '20px',
            }}
          />

          {/* Main Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              margin: '0 0 20px 0',
              lineHeight: '1.1',
              letterSpacing: '-1px',
            }}
          >
            Collegiate School
            <br />
            &nbsp;Math Club
          </h1>

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: 'linear-gradient(to right, #3b82f6, #ffffff)',
              margin: '30px 0',
              borderRadius: '2px',
            }}
          />

          {/* Tagline */}
          <p
            style={{
              fontSize: '26px',
              color: '#90cdf4',
              textAlign: 'center',
              maxWidth: '80%',
              fontWeight: '500',
            }}
          >
            Meet a new range of thinking with mathematics
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: geistMedium,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  )
}
