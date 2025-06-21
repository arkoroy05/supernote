import React from 'react'
import { StakingCard } from '@/components/web3/StakingCard'
import { StakingStats } from '@/components/web3/StakingStats'
import { StakersList } from '@/components/web3/StakersList'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BlurFade } from "@/components/ui/blur-fade"
import { SparklesText } from '@/components/ui/sparkles-text'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <BlurFade delay={0.1} inView>
            <SparklesText text="Supernote Grants" className="text-9xl font-bold text-gray-900 text-center" />
            <p className="text-2xl text-center text-gray-500">
              for the community by the community
            </p>
          </BlurFade>
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