import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <header className="h-[86px] flex justify-between items-center px-[112px] bg-inherit border-b">
      <span className="font-bold text-xl">LaborDAO</span>
      <ConnectButton></ConnectButton>
    </header>
  )
}

export default Header
