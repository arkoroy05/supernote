"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccount } from "wagmi"
import type { Abi } from "viem"
import { Users, CheckCircle, AlertCircle } from "lucide-react"

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function StakersList() {
  const { address: connectedAddress } = useAccount()

  const { useStakers, useStakeAmount } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  })

  const { data: stakers, isLoading: isStakersLoading } = useStakers()

  if (isStakersLoading) {
    return (
      <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Community Stakers</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Community Stakers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="text-slate-700 font-semibold py-4 px-6">Address</TableHead>
                <TableHead className="text-slate-700 font-semibold py-4 px-6">Stake Amount</TableHead>
                <TableHead className="text-right text-slate-700 font-semibold py-4 px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stakers?.map((stakerAddress) => (
                <StakerRow
                  key={stakerAddress}
                  address={stakerAddress}
                  isCurrentUser={stakerAddress.toLowerCase() === connectedAddress?.toLowerCase()}
                  useStakeAmount={useStakeAmount}
                />
              ))}
            </TableBody>
          </Table>

          {(!stakers || stakers.length === 0) && (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg">No stakers found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StakerRowProps {
  address: string
  isCurrentUser: boolean
  useStakeAmount: (address?: `0x${string}`) => {
    data: bigint | undefined
    isLoading: boolean
    error: Error | null
  }
}

function StakerRow({ address, isCurrentUser, useStakeAmount }: StakerRowProps) {
  const { data: stakeAmount, isLoading } = useStakeAmount(address as `0x${string}`)
  const isActive = stakeAmount && stakeAmount >= BigInt("500000000000000000")

  return (
    <TableRow className="hover:bg-slate-50 transition-colors">
      <TableCell className="font-medium py-4 px-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-900">{shortenAddress(address)}</span>
          {isCurrentUser && (
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">You</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        {isLoading ? (
          <Skeleton className="h-5 w-24 rounded" />
        ) : (
          <span className="font-semibold text-slate-900">{formatStakeAmount(stakeAmount)} ETH</span>
        )}
      </TableCell>
      <TableCell className="text-right py-4 px-6">
        <div className="flex items-center justify-end gap-2">
          {isActive ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-semibold">Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-amber-600 font-semibold">Below Minimum</span>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
