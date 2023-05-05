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
import { useQuery } from 'wagmi'
import { useSnapshot } from 'valtio'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { object, string, array, TypeOf } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getProjects, store } from '@/store'

const registerSchema = object({
  projectName: string({
    required_error: 'Project name is required',
  }).nonempty('Project name is required'),
  contributors: array(
    object({
      name: string().nonempty('Contributor is required'),
    })
  ),
})

type FormData = TypeOf<typeof registerSchema>

export default function Home() {
  const [isCreating, setIsCreating] = useState(false)
  const snap = useSnapshot(store)
  const { isConnected } = useAccount()
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'contributors',
    }
  )

  const projectQuery = useQuery(['getProjects'], getProjects, {
    enabled: isConnected && !!snap.db,
  })

  const handleFinish = useCallback((data: FormData) => {
    console.log(data)
  }, [])

  const handleCreate = useCallback(() => {
    if (!isConnected) {
      return
    }
    append({ name: '' })
    setIsCreating((v) => !v)
  }, [append, isConnected])

  const children = useMemo(() => {
    if (projectQuery.isLoading) {
      return (
        <div className="flex w-full justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton variant="rectangular" width={210} height={118} key={i} />
          ))}
        </div>
      )
    }
    if (isCreating) {
      return (
        <>
          <Typography variant="h4" className="font-bold text-[#272D37] mb-12">
            Set up project
          </Typography>
          <FormControl className="w-[58vw]">
            <form onSubmit={handleSubmit(handleFinish)}>
              <Controller
                name="projectName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    required
                    label="Project name"
                    margin="normal"
                    error={!!errors['projectName']}
                    helperText={
                      errors['projectName'] ? errors['projectName'].message : ''
                    }
                    {...field}
                  />
                )}
              />
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <Controller
                    name={`contributors.${index}.name`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        required
                        margin="normal"
                        className="flex-1"
                        label="Contributor"
                        error={!!errors['contributors']?.[index]}
                        helperText={
                          errors['contributors']?.[index]
                            ? errors['contributors']?.[index]?.name?.message
                            : ''
                        }
                        {...field}
                      />
                    )}
                  />
                  <div className="pl-4">
                    {fields.length > 1 ? (
                      <IconButton onClick={() => remove(index)}>
                        <Remove />
                      </IconButton>
                    ) : null}
                    {fields.length - 1 === index ? (
                      <IconButton onClick={() => append({ name: '' })}>
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
                type="submit"
              >
                Done
              </Button>
            </form>
          </FormControl>
        </>
      )
    }
    if (!isConnected || projectQuery.data?.length === 0) {
      return (
        <Button size="large" variant="contained" onClick={handleCreate}>
          Create a project
        </Button>
      )
    }
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
            <Typography variant="subtitle1" className="text-lg text-[#5F6D7E]">
              Hackathon DAO
            </Typography>
          </div>
        ))}
      </div>
    )
  }, [
    projectQuery.isLoading,
    projectQuery.data?.length,
    isCreating,
    isConnected,
    control,
    fields,
    errors,
    remove,
    append,
    handleSubmit,
    handleFinish,
    handleCreate,
  ])

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
        {children}
      </div>
    </Layout>
  )
}
