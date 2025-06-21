"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { Skeleton } from "@/components/ui/skeleton"
import type { Abi } from "viem"
import { TrendingUp, Users, BarChart3 } from "lucide-react"

export function StakingStats() {
  const { useTotalStaked, useStakers } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  })

  const { data: totalStaked, isLoading: isTotalLoading } = useTotalStaked()
  const { data: stakers, isLoading: isStakersLoading } = useStakers()

  const averageStake = totalStaked && stakers?.length ? Number(formatStakeAmount(totalStaked)) / stakers.length : 0

  return (
    <div className="grid gap-6 grid-cols-2 grid-rows-2">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold text-blue-900">Total Staked</CardTitle>
          <div className="p-2 bg-blue-200 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-700" />
          </div>
        </CardHeader>
        <CardContent className="">
          {isTotalLoading ? (
            <Skeleton className="h-10 w-32 rounded" />
          ) : (
            <div className="text-3xl font-bold text-blue-900">{formatStakeAmount(totalStaked)} ETH</div>
          )}
          <p className="text-sm text-blue-700 mt-2">Total value locked in staking</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold text-purple-900">Total Stakers</CardTitle>
          <div className="p-2 bg-purple-200 rounded-lg">
            <Users className="h-5 w-5 text-purple-700" />
          </div>
        </CardHeader>
        <CardContent className="">
          {isStakersLoading ? (
            <Skeleton className="h-10 w-16 rounded" />
          ) : (
            <div className="text-3xl font-bold text-purple-900">{stakers?.length || 0}</div>
          )}
          <p className="text-sm text-purple-700 mt-2">Active community members</p>
        </CardContent>
      </Card>

      <Card className="col-span-2 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold text-green-900">Average Stake</CardTitle>
          <div className="p-2 bg-green-200 rounded-lg">
            <BarChart3 className="h-5 w-5 text-green-700" />
          </div>
        </CardHeader>
        <CardContent className="">
          {isTotalLoading || isStakersLoading ? (
            <Skeleton className="h-10 w-32 rounded" />
          ) : (
            <div className="text-3xl font-bold text-green-900">{averageStake.toFixed(2)} ETH</div>
          )}
          <p className="text-sm text-green-700 mt-2">Mean stake per participant</p>
        </CardContent>
      </Card>
    </div>
  )
}