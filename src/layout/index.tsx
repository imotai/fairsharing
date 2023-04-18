import React from 'react'
import Header from './header'
import Footer from './footer'

// @ts-ignore
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
