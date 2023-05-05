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
import { ethers, utils } from 'ethers'
import { useAccount, useContract, useSigner } from 'wagmi'
import factoryabi from '../factoryabi.json'

export default function Example() {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  console.log('signer: ', signer)

  const [count, setCount] = useState(0)
  const [list, setList] = useState<string[]>([])

  const [currentDAO, setCurrentDAO] = useState<string>()

  const factoryContract = useContract({
    // todo put in the env
    address: '0x5eE4dD2C7dE5e08c92BB578a116d07558a72C9EF',
    abi: factoryabi,
    signerOrProvider: signer,
  })
  // todo detect and auto refresh the list

  useEffect(() => {
    ;(async () => {
      if (factoryContract && signer) {
        const count = await factoryContract.getCount()
        setCount(parseInt(count))
        let list: string[] = []
        for (let i = 0; i < count; i++) {
          const item = await factoryContract.fairSharings(i)
          list = [...list, item]
        }
        setList(list)
      }
    })()
  }, [factoryContract, signer])

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

      <Box>
        <Button
          onClick={() => {
            setCurrentDAO(list[0])
          }}
        >
          Use the first DAO as example
        </Button>
      </Box>
      <Box>current dao: {currentDAO}</Box>
      {currentDAO && (
        <Box marginTop={2}>
          Requester: 0x147b166fb4f1Aa9581D184596Dbabe2980ba4b14 <br />{' '}
          ContributionID: 36f38aff-c171-4461-9c4d-a2f7eafee2da
          <br /> Reason: I contributed a lot.
          <br />
          Token: 30{' '}
          <Button
            onClick={async () => {
              const msgHash = utils.solidityKeccak256(
                ['address', 'string', 'address', 'bool', 'uint256'],
                [
                  '0x147b166fb4f1Aa9581D184596Dbabe2980ba4b14',
                  '36f38aff-c171-4461-9c4d-a2f7eafee2da',
                  await signer?.getAddress(),
                  true,
                  utils.parseEther('30'),
                ]
              )
              const signature = await signer?.signMessage(
                utils.arrayify(msgHash)
              )
              console.log('signature: ', signature)
            }}
          >
            Approve
          </Button>{' '}
          <Button>Decline</Button> <Button>Claim</Button>
        </Box>
      )}
    </Box>
  )
}
