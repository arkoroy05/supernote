'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIdeaAccelerator } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { type Abi } from 'viem';
import { Loader2 } from "lucide-react";

interface RequestGrantButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function RequestGrantButton({ className, variant = "default" }: RequestGrantButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  
  // Wagmi hooks for wallet connection
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  
  // IdeaAccelerator hooks
  const {
    useIsStaker,
    useRequestGrant,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: isStaker, isLoading: isStakerLoading } = useIsStaker();
  
  const {
    requestGrant,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useRequestGrant();

  const handleSubmit = () => {
    if (!amount || !metadataURI) return;
    requestGrant(metadataURI, amount);
  };

  const isLoading = isPending || isConfirming;

  // Reset form when dialog is closed or transaction is confirmed
  const resetForm = () => {
    setAmount("");
    setMetadataURI("");
  };

  // Close dialog when transaction is confirmed
  if (isConfirmed) {
    setIsDialogOpen(false);
    resetForm();
  }

  // Handle wallet connection or dialog opening
  const handleButtonClick = () => {
    if (!isConnected) {
      connect({ connector: injected() });
    } else {
      setIsDialogOpen(true);
    }
  };

  // Determine button text based on connection and staker status
  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isStakerLoading) return "Checking status...";
    if (!isStaker) return "Stake Required";
    return "Request Grant";
  };

  return (
    <>
      <Button 
        onClick={handleButtonClick} 
        className={className}
        variant={variant}
        disabled={isConnected && (!isStaker || isStakerLoading)}
      >
        {isStakerLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {getButtonText()}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Grant</DialogTitle>
            <DialogDescription>
              Submit a new grant request for the community to review
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (ETH)
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="metadata" className="text-sm font-medium">
                Project Details URI
              </label>
              <Textarea
                id="metadata"
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
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !amount || !metadataURI}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirm in wallet..." : "Submitting..."}
              </>
            ) : (
              "Submit Grant Request"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
} 