import { DB3Store, collection, query, addDoc, where, getDocs } from 'db3.js'
import { proxy } from 'valtio'

export const store = proxy<{ db: DB3Store | null }>({
  db: null,
})

export const addDB = (db: DB3Store) => {
  store.db = db
}

interface Records {
  contract: string
  user: string
  contribution: string
  point: number
  status: number
  votes?: {
    user: string
    approve: boolean
    signature: string
  }[]
}

export const getRecords = async (contract: string) => {
  if (!store.db) return []
  const collectionRef = await collection<Records>(store.db, 'records')
  const { docs } = await getDocs<Records>(
    query(collectionRef, where('contract', '==', contract))
  )
  return docs
}

export const addRecord = async (data: Records) => {
  if (!store.db) return
  const collectionRef = await collection<Records>(store.db, 'records')
  await addDoc<Records>(collectionRef, data)
}
