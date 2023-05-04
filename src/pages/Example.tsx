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
import { ContractFactory } from 'ethers'
import { useAccount, useContract, useSigner } from 'wagmi'
import factoryabi from '../factoryabi.json'

export default function Example() {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  console.log('signer: ', signer)
  const contract = useContract({
    // todo put in the env
    address: '0x0711a3d4ea0e5e53f52Cda8dF2c1D276b85AaA37',
    abi: factoryabi,
    signerOrProvider: signer,
  })

  return (
    <Box>
      <Button
        onClick={async () => {
          const tx = await contract?.createFairSharing(
            'FairDAO',
            'FD',
            // todo add the member lists
            [address],
            address
          )
          // todo pop up the notification or toast
          console.log('tx', tx)
        }}
      >
        Create a DAO contract with name: FairDAO
      </Button>
    </Box>
  )
}
