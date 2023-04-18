import Layout from '@/layout'
import { Typography, Button } from '@mui/material'

export default function Home() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-full flex-col">
        <Typography variant="h2" className="font-bold text-[#272D37] mb-6">
          A tool for LaborDAO
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-lg text-[#5F6D7E] mb-12"
        >
          Upgrade your side project into a DAO and turbocharge it.
        </Typography>
        <Button size="large" variant="contained">
          Create a project
        </Button>
      </div>
    </Layout>
  )
}
