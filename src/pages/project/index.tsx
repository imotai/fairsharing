import React, { useCallback } from 'react'
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
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import { useRouter } from 'next/router'

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

const Project = () => {
  const router = useRouter()

  const [contributor, setContributor] = React.useState('All')
  const [showDialog, setShowDialog] = React.useState(false)

  const handleChangeContributor = useCallback((event: SelectChangeEvent) => {
    setContributor(event.target.value)
  }, [])

  const handleDialog = useCallback(() => {
    setShowDialog((v) => !v)
  }, [])

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
      <Select
        className="w-[150px] mb-6"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={contributor}
        label="Contributor"
        onChange={handleChangeContributor}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.calories}</TableCell>
                <TableCell align="left">{row.fat}</TableCell>
                <TableCell align="left">{row.carbs}</TableCell>
                <TableCell align="left">
                  <Button variant="text" color="error" onClick={handleDialog}>
                    Reject
                  </Button>
                  <Button variant="text" onClick={handleDialog}>
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        rowsPerPage={5}
        rowsPerPageOptions={[10]}
        page={0}
        onPageChange={() => {}}
      />
      <Dialog
        open={showDialog}
        onClose={handleDialog}
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
          <Button onClick={handleDialog}>Cancel</Button>
          <Button onClick={() => {}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Project
