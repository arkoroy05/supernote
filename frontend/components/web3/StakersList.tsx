'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "wagmi";
import { type Abi } from 'viem';
function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function StakersList() {
  const { address: connectedAddress } = useAccount();
  
  const {
    useStakers,
    useStakeAmount,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: stakers, isLoading: isStakersLoading } = useStakers();

  if (isStakersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Stakers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Stakers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Stake Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
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
          <div className="text-center py-4 text-muted-foreground">
            No stakers found
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StakerRowProps {
  address: string;
  isCurrentUser: boolean;
  useStakeAmount: (address?: `0x${string}`) => { 
    data: bigint | undefined; 
    isLoading: boolean; 
    error: Error | null 
  };
}

function StakerRow({ address, isCurrentUser, useStakeAmount }: StakerRowProps) {
  const { data: stakeAmount, isLoading } = useStakeAmount(address as `0x${string}`);
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        {shortenAddress(address)}
        {isCurrentUser && (
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            You
          </span>
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton className="h-4 w-[100px]" />
        ) : (
          `${formatStakeAmount(stakeAmount)} ETH`
        )}
      </TableCell>
      <TableCell className="text-right">
        {stakeAmount && stakeAmount >= BigInt("500000000000000000") ? (
          <span className="text-green-500">Active</span>
        ) : (
          <span className="text-yellow-500">Below Minimum</span>
        )}
      </TableCell>
    </TableRow>
  );
} 