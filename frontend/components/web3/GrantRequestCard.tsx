'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIdeaAccelerator } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { useState } from "react";
import { type Abi } from 'viem';


export function GrantRequestCard() {
  const [amount, setAmount] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  
  
  const {
    useIsStaker,
    useRequestGrant,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: isStaker } = useIsStaker();
  
  const {
    requestGrant,
    isPending,
    isConfirming,
    error
  } = useRequestGrant();

  const handleSubmit = () => {
    if (!amount || !metadataURI) return;
    requestGrant(metadataURI, amount);
  };

  const isLoading = isPending || isConfirming;

  if (!isStaker) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request Grant</CardTitle>
          <CardDescription className="text-red-500">
            You need to stake at least 0.5 ETH to request grants
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Request Grant</CardTitle>
        <CardDescription>
          Submit a new grant request for the community to review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.1"
            step="0.1"
          />
          <Textarea
            placeholder="IPFS URI or metadata link containing project details"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error.message}
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !amount || !metadataURI}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit Grant Request"}
        </Button>
      </CardContent>
    </Card>
  );
} 