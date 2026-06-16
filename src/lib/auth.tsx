/*
 * The main root of authentication. Use auth in server components
 * and pass header().
 */

import { getAuthenticatorName, passkey } from '@better-auth/passkey'
import { redisStorage } from '@better-auth/redis-storage'
import { EmailTemplate } from '@daveyplate/better-auth-ui/server'
import { dymoEmailPlugin } from '@dymo-api/better-auth'
import { Section } from '@react-email/components'
import { render } from '@react-email/render'
import { emailHarmony } from 'better-auth-harmony'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { admin, haveIBeenPwned, multiSession, openAPI, twoFactor, username } from 'better-auth/plugins'
import { db } from '@/lib/db'
import { transporter } from './email'
import { redis } from './redis'
import { authSchema } from './schema'

export const auth = betterAuth({
  rateLimit: {
    storage: 'secondary-storage',
  },
  experimental: {
    joins: true,
  },
  appName: 'Collegiate School Math Club',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const name = user.name || user.email.split('@')[0]
      const html = await render(
        <EmailTemplate
          action="Reset Your Password"
          content={(
            <>
              <p>
                {`Hello ${name},`}
              </p>

              <p>
                Click the button below to reset your password.
              </p>
            </>
          )}
          heading="Reset Your Password"
          siteName="CSMC"
          baseUrl="https://collegiateschoolmathclub.netlify.app"
          url={url}
          imageUrl="https://collegiateschoolmathclub.netlify.app/png-logos/CSMC.png"
        />,
      )
      transporter.sendMail({
        from: `"CSMC" <${process.env.EMAIL!}>`,
        to: user.email,
        subject: 'Reset Your Password',
        html,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const name = user.name || user.email.split('@')[0]
      const html = await render(
        <EmailTemplate
          action="Verify Email"
          content={(
            <>
              <p>
                {`Hello ${name},`}
              </p>

              <p>
                Click the button below to verify your email address.
              </p>
            </>
          )}
          heading="Verify Email"
          siteName="CSMC"
          baseUrl="https://collegiateschoolmathclub.netlify.app"
          url={url}
          imageUrl="https://collegiateschoolmathclub.netlify.app/png-logos/CSMC.png"
        />,
      )
      transporter.sendMail({
        from: `"CSMC" <${process.env.EMAIL!}>`,
        to: user.email,
        subject: 'Verify your email address',
        html,
      })
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    },
  },
  secondaryStorage: redisStorage({
    client: redis,
  }),
  plugins: [
    haveIBeenPwned(),
    openAPI(),
    admin(),
    emailHarmony(),
    username(),
    multiSession(),
    twoFactor({
      issuer: 'CSMC',
      otpOptions: {
        async sendOTP({ user, otp }) {
          const name = user.name || user.email.split('@')[0]
          const html = await render(
            <EmailTemplate
              content={(
                <>
                  <p>
                    {`Hello ${name},`}
                  </p>

                  <p>
                    Below is your verification code.
                  </p>
                  <Section className="text-center my-5">
                    <div
                      className="inline-block px-5 py-3 rounded font-semibold text-[12px] cursor-text select-all action-button"
                    >
                      {otp}
                    </div>
                  </Section>
                </>
              )}
              heading="Confirm Sign In"
              siteName="CSMC"
              baseUrl="https://collegiateschoolmathclub.netlify.app"
              imageUrl="https://collegiateschoolmathclub.netlify.app/png-logos/CSMC.png"
            />,
          )
          transporter.sendMail({
            from: `"CSMC" <${process.env.EMAIL!}>`,
            to: user.email,
            subject: `${otp} Is Your Verification Code`,
            html,
          })
        },
      },
    }),
    passkey({
      rpID: process.env.BASE_URL!.replace(/^https:\/\//, ''),
      rpName: 'Collegiate School Math Club',
      origin: process.env.BASE_URL!,
      registration: {
        afterVerification: async ({ verification }) => ({
          name: getAuthenticatorName(verification.registrationInfo?.aaguid),
        }),
      },
    }),
    dymoEmailPlugin({
      apiKey: process.env.DYMO_API_KEY!,
    }),
  ],
})
