import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <header className="h-[86px] flex justify-between items-center px-[112px] bg-inherit border-b border-solid border-slate-200 fixed z-10 left-0 right-0">
      <span className="font-bold text-xl">LaborDAO</span>
      <ConnectButton></ConnectButton>
    </header>
  )
}

export default Header
