import React from 'react'
import Header from './header'
import Footer from './footer'

// @ts-ignore
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      <Header />
      <main className="flex-1 pt-[86px] flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
