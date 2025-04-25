import { authViewPaths } from '@daveyplate/better-auth-ui/server'
import { AuthView } from './view'

export function generateStaticParams() {
  return Object.values(authViewPaths).map(pathname => ({ pathname }))
}

export default async function AuthPage({ params }: { params: Promise<{ pathname: string }> }) {
  const { pathname } = await params

  return (
    <div className="pt-15">
      <AuthView pathname={pathname} />
    </div>
  )
}
