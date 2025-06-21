import React from 'react'
import { StakingCard } from '@/components/web3/StakingCard'
import { StakingStats } from '@/components/web3/StakingStats'
import { StakersList } from '@/components/web3/StakersList'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">Supernote Community Grants</h1>
            <div className="flex justify-center">
                <ConnectButton />
            </div>
            <StakingCard />
            <StakingStats />
            <StakersList />
        </div>
    </div>
  )
}

export default page