'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { Skeleton } from "@/components/ui/skeleton";

export function StakingStats() {
  const {
    useTotalStaked,
    useStakers,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: totalStaked, isLoading: isTotalLoading } = useTotalStaked();
  const { data: stakers, isLoading: isStakersLoading } = useStakers();

  const averageStake = totalStaked && stakers?.length 
    ? Number(formatStakeAmount(totalStaked)) / stakers.length 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
        </CardHeader>
        <CardContent>
          {isTotalLoading ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">
              {formatStakeAmount(totalStaked)} ETH
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stakers</CardTitle>
        </CardHeader>
        <CardContent>
          {isStakersLoading ? (
            <Skeleton className="h-7 w-[60px]" />
          ) : (
            <div className="text-2xl font-bold">
              {stakers?.length || 0}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Stake</CardTitle>
        </CardHeader>
        <CardContent>
          {isTotalLoading || isStakersLoading ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div className="text-2xl font-bold">
              {averageStake.toFixed(2)} ETH
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 