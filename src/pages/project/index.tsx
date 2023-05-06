import React, { useCallback, useState } from 'react'
import Layout from '@/layout'
import {
  Breadcrumbs,
  Typography,
  Link,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useAccount, useContract, useQuery, useSigner } from 'wagmi'
import fairSharingAbi from '@/fairSharingabi.json'
import { addRecord, getRecords, store } from '@/store'
import { useSnapshot } from 'valtio'
import { object, string, TypeOf, coerce } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'

const registerSchema = object({
  contribution: string().nonempty('contribution is required'),
  point: coerce.number().min(0, 'point should be greater than 0'),
})

type FormData = TypeOf<typeof registerSchema>

const Project = () => {
  const router = useRouter()
  const contractAddress = router.query.address as string
  const snap = useSnapshot(store)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const factoryContract = useContract({
    address: contractAddress,
    abi: fairSharingAbi,
    signerOrProvider: signer,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  const [contributor, setContributor] = useState('All')
  const [showVoteDialog, setShowVoteDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const recordsQuery = useQuery(
    ['getRecords', contractAddress],
    () => getRecords(contractAddress),
    {
      enabled: !!contractAddress && store.initDb,
    }
  )

  const handleChangeContributor = useCallback((event: SelectChangeEvent) => {
    setContributor(event.target.value)
  }, [])

  const handleVoteDialog = useCallback(() => {
    setShowVoteDialog((v) => !v)
  }, [])

  const handleAddDialog = useCallback(() => {
    setShowAddDialog((v) => !v)
  }, [])

  const handleFinish = useCallback(
    async (data: FormData) => {
      if (!address) return
      const { contribution, point } = data
      await addRecord({
        contribution,
        point,
        user: address,
        status: 0,
        contract: contractAddress,
      })
      setTimeout(async () => {
        await recordsQuery.refetch()
        handleAddDialog()
        reset()
      }, 2000)
    },
    [address, contractAddress, handleAddDialog, recordsQuery, reset]
  )

  return (
    <Layout>
      <Breadcrumbs
        aria-label="breadcrumb"
        className="h-[80px] flex items-center"
      >
        <Link
          underline="hover"
          color="inherit"
          className="cursor-pointer"
          onClick={() => router.push('/')}
        >
          Home
        </Link>
        <Typography>Project</Typography>
      </Breadcrumbs>
      <Typography variant="h4" className="text-[#272D37] my-6">
        Contributions
      </Typography>
      <Button
        size="large"
        variant="contained"
        onClick={handleAddDialog}
        className="mb-8 w-[250px]"
      >
        Add Contribution
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contribution</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsQuery.data?.map((row) => {
              const { doc, id } = row.entry
              return (
                <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {doc.user}
                  </TableCell>
                  <TableCell align="left">{doc.contribution}</TableCell>
                  <TableCell align="left">{doc.point}</TableCell>
                  <TableCell align="left">{doc.status}</TableCell>
                  <TableCell align="left">
                    <Button
                      variant="text"
                      color="error"
                      onClick={handleVoteDialog}
                    >
                      Reject
                    </Button>
                    <Button variant="text" onClick={handleVoteDialog}>
                      Approve
                    </Button>
                    <Button variant="text" onClick={handleVoteDialog}>
                      Claim
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={recordsQuery.data?.length || 0}
        rowsPerPage={3}
        rowsPerPageOptions={[10]}
        page={0}
        onPageChange={() => {}}
      />
      <Dialog
        open={showVoteDialog}
        onClose={handleVoteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Vote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVoteDialog}>Cancel</Button>
          <Button onClick={() => {}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showAddDialog}
        onClose={handleAddDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Contribution</DialogTitle>
        <DialogContent>
          <form className="flex flex-col min-w-[400px]">
            <Controller
              name="contribution"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
                  multiline
                  label="Contribution"
                  margin="normal"
                  error={!!errors['contribution']}
                  helperText={
                    errors['contribution'] ? errors['contribution'].message : ''
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="point"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
                  type="number"
                  label="Point"
                  margin="normal"
                  error={!!errors['point']}
                  helperText={errors['point'] ? errors['point'].message : ''}
                  {...field}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialog}>Cancel</Button>
          <LoadingButton onClick={handleSubmit(handleFinish)} autoFocus>
            Done
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Project
