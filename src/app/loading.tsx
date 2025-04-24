import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Grid
        size="127"
        speed="1.5"
        color="white"
      />
    </div>
  )
}
