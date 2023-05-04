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
import { ContractFactory } from 'ethers'

export default function Example() {
  return (
    <Box>
      <Button
        onClick={async () => {
          //  todo
        }}
      >
        Create a DAO contract with name: FairDAO
      </Button>
    </Box>
  )
}
