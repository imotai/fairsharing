import { MetamaskWallet, initializeDB3 } from 'db3.js'
import { useEffect } from 'react'
import Header from './header'
import Footer from './footer'

// @ts-ignore
const Layout = ({ children }) => {
  useEffect(() => {
    // @ts-ignore
    const wallet = new MetamaskWallet(window)
    const client = initializeDB3('https://grpc.devnet.db3.network', '0xf94c8287560cd1572d81e67e25c995eb23b759b4', wallet)
    console.log(client)
  }, [])
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      <Header />
      <main className="flex-1 py-[86px] px-[112px] flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
