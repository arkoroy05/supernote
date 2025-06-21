'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIdeaAccelerator, formatGrantAmount, useGrantApprovalStatus } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { useEffect, useState } from "react";
import { type Abi } from 'viem';


interface GrantCardProps {
  grantId: number;
}

function GrantCard({ grantId }: GrantCardProps) {
  const {
    useGrant,
    useHasApproved,
    useApproveGrant,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: grant, isLoading: isGrantLoading } = useGrant(grantId);
  const { data: hasApproved } = useHasApproved(grantId);
  const { approvalPercentage, isReadyForFunding, needsMoreApproval } = useGrantApprovalStatus(
    CONTRACT_ADDRESS,
    CONTRACT_ABI as Abi,
    grantId
  );

  const {
    approveGrant,
    isPending,
    isConfirming,
  } = useApproveGrant();

  const handleApprove = () => {
    approveGrant(grantId);
  };

  const isLoading = isPending || isConfirming || isGrantLoading;

  if (!grant || isGrantLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Grant #{grantId}</CardTitle>
        <CardDescription>
          Requested by: {grant.requester}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            Amount: {formatGrantAmount(grant.amountRequested)} ETH
          </div>
          <div className="text-sm">
            Status: {grant.funded ? "Funded" : "Pending"}
          </div>
          <a 
            href={grant.metadataURI}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View Details
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Approval Progress</span>
            <span>{approvalPercentage}%</span>
          </div>
          <Progress value={approvalPercentage} className="h-2" />
          {!isReadyForFunding && (
            <div className="text-sm text-muted-foreground">
              Needs {needsMoreApproval}% more approval
            </div>
          )}
        </div>

        {!grant.funded && !hasApproved && (
          <Button
            onClick={handleApprove}
            disabled={isLoading || hasApproved}
            className="w-full"
          >
            {isLoading ? "Approving..." : "Approve Grant"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function GrantsList() {
  const [grants, setGrants] = useState<number[]>([]);
  const { useGrantCount } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: grantCount } = useGrantCount();

  useEffect(() => {
    if (grantCount) {
      // Create array from 1 to grantCount
      setGrants(Array.from({ length: grantCount - 1 }, (_, i) => i + 1));
    }
  }, [grantCount]);

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Active Grants</div>
      <div className="grid gap-6 md:grid-cols-2">
        {grants.map((grantId) => (
          <GrantCard key={grantId} grantId={grantId} />
        ))}
      </div>
      {grants.length === 0 && (
        <Card>
          <CardContent className="py-4 text-center text-muted-foreground">
            No grants found
          </CardContent>
        </Card>
      )}
    </div>
  );
} 