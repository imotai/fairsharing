import { useCallback, useMemo, useState, useEffect } from 'react'
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

  const [count, setCount] = useState(0)
  const [list, setList] = useState<string[]>([])

  console.log('signer: ', signer)
  const factoryContract = useContract({
    // todo put in the env
    address: '0x5eE4dD2C7dE5e08c92BB578a116d07558a72C9EF',
    abi: factoryabi,
    signerOrProvider: signer,
  })
  // todo detect and auto refresh the list

  useEffect(() => {
    ;(async () => {
      console.log('factoryContract: ', factoryContract)
      if (factoryContract) {
        const count = await factoryContract.getCount()
        setCount(parseInt(count))
        let list: string[] = []
        for (let i = 0; i < count; i++) {
          const item = await factoryContract.fairSharings(i)
          list = [...list, item]
        }
        setList(list)
        console.log('list: ', list)
      }
    })()
  }, [factoryContract])

  return (
    <Box>
      <Button
        onClick={async () => {
          const tx = await factoryContract?.createFairSharing(
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

      <Box>There are {count} DAOs. List:</Box>

      <Box>
        {list.map((item) => {
          return <div key={item}>{item}</div>
        })}
      </Box>
    </Box>
  )
}
