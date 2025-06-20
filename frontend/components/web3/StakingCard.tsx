'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIdeaAccelerator, formatStakeAmount } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { useState } from "react";
import { useAccount } from "wagmi";

export function StakingCard() {
  const [stakeAmount, setStakeAmount] = useState("");
  const { address } = useAccount();
  
  const {
    useStakeAmount,
    useTotalStaked,
    useStake,
    useUnstake,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: userStake } = useStakeAmount();
  const { data: totalStaked } = useTotalStaked();
  
  const {
    stake,
    isPending: isStakePending,
    isConfirming: isStakeConfirming,
  } = useStake();

  const {
    unstake,
    isPending: isUnstakePending,
    isConfirming: isUnstakeConfirming,
  } = useUnstake();

  const handleStake = () => {
    if (!stakeAmount) return;
    stake(stakeAmount);
  };

  const handleUnstake = () => {
    unstake();
  };

  const isLoading = isStakePending || isStakeConfirming || isUnstakePending || isUnstakeConfirming;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Stake ETH</CardTitle>
        <CardDescription>
          Stake ETH to participate in grant approvals. Minimum stake is 0.5 ETH.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Your stake: {formatStakeAmount(userStake)} ETH
          </div>
          <div className="text-sm text-muted-foreground">
            Total staked: {formatStakeAmount(totalStaked)} ETH
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Amount in ETH"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            min="0.5"
            step="0.1"
          />
          <Button 
            onClick={handleStake}
            disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) < 0.5}
          >
            {isStakePending || isStakeConfirming ? "Staking..." : "Stake"}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleUnstake}
          disabled={isLoading || !userStake || userStake <= 0n}
          className="w-full"
        >
          {isUnstakePending || isUnstakeConfirming ? "Unstaking..." : "Unstake"}
        </Button>
      </CardContent>
    </Card>
  );
} 