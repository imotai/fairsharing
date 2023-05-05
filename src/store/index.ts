import { DB3Store, collection, getDocs, addDoc } from 'db3.js'
import { proxy } from 'valtio'

export const store = proxy<{ db: DB3Store | null }>({
  db: null,
})

export const addDB = (db: DB3Store) => {
  store.db = db
}

interface Projects {
  wallet: string
  name: string
}

export const getProjects = async () => {
  if (!store.db) return []
  const collectionRef = await collection<Projects>(store.db, 'projects')
  const { docs } = await getDocs<Projects>(collectionRef)
  return docs
}

export const addProject = async ({ wallet, name }: { wallet: string, name: string }) => {
  if (!store.db) return
  const collectionRef = await collection<Projects>(store.db, 'projects')
  await addDoc<Projects>(collectionRef, {
    wallet,
    name
  })
}