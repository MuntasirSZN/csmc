import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <TailChase
        color="#4f46e5"
        size={100}
        speed={1}
      />
    </div>
  )
}
