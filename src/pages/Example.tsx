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
import instanceabi from '../instanceabi.json'

export default function Example() {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  console.log('signer: ', signer)

  const [count, setCount] = useState(0)
  const [list, setList] = useState<string[]>([])

  const [currentDAO, setCurrentDAO] = useState<string>()

  const factoryContract = useContract({
    // todo put in the env
    address: '0xe7bFf2ce0EE5d23df03c404db523e980C1D5Bc37',
    abi: factoryabi,
    signerOrProvider: signer,
  })
  // todo detect and auto refresh the list

  // todo need to create a new component or find a way to update the contact address
  const fairSharingContract = useContract({
    address: '0x3a564eE2dF78Eb1c6871Ff93ad9BF54937b34266',
    abi: instanceabi,
    signerOrProvider: signer,
  })
  console.log('fairSharingContract: ', fairSharingContract)

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
            ['', '', ''],
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
            setCurrentDAO('0x3a564eE2dF78Eb1c6871Ff93ad9BF54937b34266')
          }}
        >
          Use the 0x3a564eE2dF78Eb1c6871Ff93ad9BF54937b34266 DAO as example
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
                ['address', 'uint256', 'address', 'bool', 'uint256'],
                [
                  '0x147b166fb4f1Aa9581D184596Dbabe2980ba4b14',
                  1,
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
          <Button
            onClick={async () => {
              const msgHash = utils.solidityKeccak256(
                ['address', 'uint256', 'address', 'bool', 'uint256'],
                [
                  '0x147b166fb4f1Aa9581D184596Dbabe2980ba4b14',
                  1,
                  await signer?.getAddress(),
                  false,
                  utils.parseEther('30'),
                ]
              )
              const signature = await signer?.signMessage(
                utils.arrayify(msgHash)
              )
              console.log('signature: ', signature)
            }}
          >
            Decline
          </Button>{' '}
          <Button
            onClick={async () => {
              console.log('fairSharingContract: ', fairSharingContract)
              const tx = fairSharingContract?.claim(1, utils.parseEther('30'), [
                {
                  voter: '0x147b166fb4f1Aa9581D184596Dbabe2980ba4b14',
                  approve: true,
                  signature: '',
                },
              ])
              // todo pop up the notification or toast
              console.log('tx', tx)
            }}
          >
            Claim
          </Button>
          Notes: 1. only record creator can claim. 2. the creator must be a
          member.
          <Button
            onClick={() => {
              // todo deposit
            }}
          >
            Deposit
          </Button>
        </Box>
      )}
    </Box>
  )
}
