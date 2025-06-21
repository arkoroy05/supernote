"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { useState } from "react"
import type { Abi } from "viem"
import { Coins, TrendingUp } from "lucide-react"

export function StakingCard() {
  const [stakeAmount, setStakeAmount] = useState("")

  const { useStakeAmount, useTotalStaked, useStake, useUnstake } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  })

  const { data: userStake } = useStakeAmount()
  const { data: totalStaked } = useTotalStaked()

  const { stake, isPending: isStakePending, isConfirming: isStakeConfirming } = useStake()

  const { unstake, isPending: isUnstakePending, isConfirming: isUnstakeConfirming } = useUnstake()

  const handleStake = () => {
    if (!stakeAmount) return
    stake(stakeAmount)
  }

  const handleUnstake = () => {
    unstake()
  }

  const isLoading = isStakePending || isStakeConfirming || isUnstakePending || isUnstakeConfirming

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-8 pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Coins className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Stake ETH</CardTitle>
        </div>
        <CardDescription className="text-lg text-slate-600">
          Stake ETH to participate in grant approvals. Minimum stake is 0.5 ETH.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm font-medium text-slate-500 mb-2">Your Stake</div>
            <div className="text-2xl font-bold text-slate-900">{formatStakeAmount(userStake)} ETH</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm font-medium text-slate-500 mb-2">Total Staked</div>
            <div className="text-2xl font-bold text-slate-900">{formatStakeAmount(totalStaked)} ETH</div>
          </div>
        </div>

        {/* Staking Input Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-slate-900">Add to Stake</span>
          </div>

          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Amount in ETH"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              min="0.5"
              step="0.1"
              className="text-lg h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={handleStake}
              disabled={isLoading || !stakeAmount || Number.parseFloat(stakeAmount) < 0.5}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              size="lg"
            >
              {isStakePending || isStakeConfirming ? "Staking..." : "Stake"}
            </Button>
          </div>
        </div>

        {/* Unstake Section */}
        <Button
          variant="outline"
          onClick={handleUnstake}
          disabled={isLoading || !userStake || userStake <= BigInt(0)}
          className="w-full h-12 text-lg font-semibold border-2 border-slate-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
          size="lg"
        >
          {isUnstakePending || isUnstakeConfirming ? "Unstaking..." : "Unstake All"}
        </Button>
      </CardContent>
    </Card>
  )
}
