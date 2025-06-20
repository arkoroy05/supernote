import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { GrantsList } from '@/components/web3/GrantsList'
import { GrantRequestCard } from '@/components/web3/GrantRequestCard'
import { StakingCard } from '@/components/web3/StakingCard'
import { StakersList } from '@/components/web3/StakersList'
import { StakingStats } from '@/components/web3/StakingStats'
const page = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <StakingCard />
      <ConnectButton />
      <GrantsList />
      <GrantRequestCard />
      <StakersList />
      <StakingStats />
    </div>
  )
}

export default page