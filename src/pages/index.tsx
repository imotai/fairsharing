import { useCallback, useMemo, useState } from 'react'
import Layout from '@/layout'
import {
  Typography,
  Button,
  FormControl,
  TextField,
  IconButton,
  Skeleton,
  Box,
} from '@mui/material'
import { Remove, Add } from '@mui/icons-material'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import Example from './Example'

let index = 1
export default function Home() {
  const [isCreating, setIsCreating] = useState(false)
  const [contributors, setContributors] = useState([1])
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected } = useAccount()

  const handleCreate = useCallback(() => {
    setIsCreating(false)
  }, [])

  const handleContributors = useCallback((isAdd: boolean, item?: number) => {
    index++
    if (isAdd) {
      setContributors((v) => v.concat(index))
    } else {
      setContributors((v) => v.filter((i) => i !== item))
    }
  }, [])

  const children = useMemo(() => {
    if (!isConnected) {
      return (
        <Button
          size="large"
          variant="contained"
          onClick={() => setIsCreating(true)}
        >
          Create a project
        </Button>
      )
    }
    if (isLoading) {
      return (
        <div className="flex w-full justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton variant="rectangular" width={210} height={118} key={i} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="flex w-full justify-between">
          {[1].map((item, index) => (
            <div
              key={index}
              className="cursor-pointer border border-[#EAEBF0] border-solid w-[286px] h-[184px] rounded flex flex-col justify-center items-center"
            >
              <Image
                src="/projectIcon.png"
                alt="projectIcon"
                width={48}
                height={48}
                className="mb-3"
              />
              <Typography
                variant="subtitle1"
                className="text-lg text-[#5F6D7E]"
              >
                Hackathon DAO
              </Typography>
            </div>
          ))}
        </div>
      )
    }
    return (
      <>
        <Typography variant="h4" className="font-bold text-[#272D37] mb-12">
          Set up project
        </Typography>
        <FormControl className="w-[58vw]">
          <TextField required id="name" label="Project name" margin="normal" />
          {contributors.map((index, i) => (
            <div key={index} className="flex items-center">
              <TextField
                required
                id={`contributors${index}`}
                label={`contributors`}
                margin="normal"
                className="flex-1"
              />
              <div className="pl-4">
                {contributors.length > 1 ? (
                  <IconButton onClick={() => handleContributors(false, index)}>
                    <Remove />
                  </IconButton>
                ) : null}
                {contributors.length - 1 === i ? (
                  <IconButton onClick={() => handleContributors(true)}>
                    <Add />
                  </IconButton>
                ) : null}
              </div>
            </div>
          ))}
          <Button
            size="large"
            variant="contained"
            className="w-[150px] mt-4"
            onClick={handleCreate}
          >
            Done
          </Button>
        </FormControl>
      </>
    )
  }, [isCreating, contributors, isLoading, isConnected])

  return (
    <Layout>
      <div className="flex items-center justify-center flex-1 flex-col mt-12">
        <Typography variant="h2" className="font-bold text-[#272D37] mb-6">
          A tool for LaborDAO
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-lg text-[#5F6D7E] mb-12"
        >
          Upgrade your side project into a DAO and turbocharge it.
        </Typography>
        {/* {children} */}
      </div>
      <Example />
    </Layout>
  )
}
