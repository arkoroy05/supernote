import { 
    useReadContract, 
    useWriteContract, 
    useWaitForTransactionReceipt,
    useAccount,
} from 'wagmi';
import type { Address, Abi } from 'viem';
import { parseEther, formatEther } from 'viem';
import { useMemo } from 'react';
  
// Types based on your contract
export interface GrantRequest {
  requester: `0x${string}`;
  metadataURI: string;
  amountRequested: bigint;
  approvalWeight: bigint;
  funded: boolean;
}
  
export interface UseIdeaAcceleratorProps {
  contractAddress: `0x${string}`;
  abi: Abi;
}
  
export interface UseIdeaAcceleratorHooks {
  // Read hooks
  useStakeAmount: (address?: Address) => { data: bigint | undefined; isLoading: boolean; error: Error | null };
  useTotalStaked: () => { data: bigint | undefined; isLoading: boolean; error: Error | null };
  useIsStaker: (address?: Address) => { data: boolean; isLoading: boolean; error: Error | null };
  useStakers: () => { data: Address[] | undefined; isLoading: boolean; error: Error | null };
  useGrant: (grantId: number) => { data: GrantRequest | undefined; isLoading: boolean; error: Error | null };
  useGrantCount: () => { data: number | undefined; isLoading: boolean; error: Error | null };
  useHasApproved: (grantId: number, address?: Address) => { data: boolean | undefined; isLoading: boolean; error: Error | null };
  useContractBalance: () => { data: bigint | undefined; isLoading: boolean; error: Error | null };
  
  // Write hooks
  useStake: () => {
    stake: (amount: string) => void;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: Error | null;
    hash: string | undefined;
  };
  useUnstake: () => {
    unstake: () => void;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: Error | null;
    hash: string | undefined;
  };
  useRequestGrant: () => {
    requestGrant: (metadataURI: string, amountEther: string) => void;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: Error | null;
    hash: string | undefined;
  };
  useApproveGrant: () => {
    approveGrant: (grantId: number) => void;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: Error | null;
    hash: string | undefined;
  };
}
  
export function useIdeaAccelerator({ contractAddress, abi }: UseIdeaAcceleratorProps): UseIdeaAcceleratorHooks {
  const { address: connectedAddress } = useAccount();

  // Read Hooks
  const useStakeAmount = (address?: `0x${string}`) => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'stakes',
      args: [(address || connectedAddress) as `0x${string}`],
      query: {
        enabled: !!(address || connectedAddress),
      },
    });

    return {
      data: data as bigint | undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  const useTotalStaked = () => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'totalStaked',
    });

    return {
      data: data as bigint | undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  const useIsStaker = (address?: Address) => {
    const { data: stakeAmount, isLoading, error } = useStakeAmount(address);
    const minStake = parseEther('0.5');

    return {
      data: stakeAmount ? stakeAmount >= minStake : false,
      isLoading,
      error,
    };
  };

  const useStakers = () => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'getStakers',
    });

    return {
      data: data as Address[] | undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  const useGrantCount = () => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'grantCount',
    });

    return {
      data: data ? Number(data) : undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  const useGrant = (grantId: number) => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'getGrant',
      args: [BigInt(grantId)],
      query: {
        enabled: grantId > 0,
      },
    });

    const transformedData = useMemo(() => {
      if (!data || !Array.isArray(data)) return undefined;
      
      return {
        requester: data[0] as `0x${string}`,
        metadataURI: data[1] as string,
        amountRequested: data[2] as bigint,
        approvalWeight: data[3] as bigint,
        funded: data[4] as boolean,
      } as GrantRequest;
    }, [data]);

    return {
      data: transformedData,
      isLoading,
      error: error as Error | null,
    };
  };

  const useHasApproved = (grantId: number, address?: `0x${string}`) => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'hasApproved',
      args: [BigInt(grantId), (address || connectedAddress) as `0x${string}`],
      query: {
        enabled: !!(address || connectedAddress) && grantId > 0,
      },
    });

    return {
      data: data as boolean | undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  const useContractBalance = () => {
    const { data, isLoading, error } = useReadContract({
      address: contractAddress,
      abi,
      functionName: 'totalStaked', // Using totalStaked as proxy for available balance
    });

    return {
      data: data as bigint | undefined,
      isLoading,
      error: error as Error | null,
    };
  };

  // Write Hooks
  const useStake = () => {
    const { writeContract, isPending, error, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });

    const stake = (amount: string) => {
      const value = parseEther(amount);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'stake',
        args: [],
        value,
      });
    };

    return {
      stake,
      isPending,
      isConfirming,
      isConfirmed,
      error: error as Error | null,
      hash,
    };
  };

  const useUnstake = () => {
    const { writeContract, isPending, error, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });

    const unstake = () => {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'unstake',
        args: [],
      });
    };

    return {
      unstake,
      isPending,
      isConfirming,
      isConfirmed,
      error: error as Error | null,
      hash,
    };
  };

  const useRequestGrant = () => {
    const { writeContract, isPending, error, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });

    const requestGrant = (metadataURI: string, amountEther: string) => {
      const amountWei = parseEther(amountEther);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'requestGrant',
        args: [metadataURI, amountWei],
      });
    };

    return {
      requestGrant,
      isPending,
      isConfirming,
      isConfirmed,
      error: error as Error | null,
      hash,
    };
  };

  const useApproveGrant = () => {
    const { writeContract, isPending, error, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });

    const approveGrant = (grantId: number) => {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'approveGrant',
        args: [BigInt(grantId)],
      });
    };

    return {
      approveGrant,
      isPending,
      isConfirming,
      isConfirmed,
      error: error as Error | null,
      hash,
    };
  };

  return {
    // Read hooks
    useStakeAmount,
    useTotalStaked,
    useIsStaker,
    useStakers,
    useGrant,
    useGrantCount,
    useHasApproved,
    useContractBalance,
    
    // Write hooks
    useStake,
    useUnstake,
    useRequestGrant,
    useApproveGrant,
  };
}

// Utility hooks for common patterns
export function useGrantApprovalStatus(
  contractAddress: Address,
  abi: Abi,
  grantId: number
) {
  const hooks = useIdeaAccelerator({ contractAddress, abi });
  const { data: grant } = hooks.useGrant(grantId);
  const { data: totalStaked } = hooks.useTotalStaked();

  const approvalPercentage = useMemo(() => {
    if (!grant || !totalStaked || totalStaked === BigInt(0)) return 0;
    return Number((grant.approvalWeight * BigInt(100)) / totalStaked);
  }, [grant, totalStaked]);

  const isReadyForFunding = approvalPercentage >= 65;
  const needsMoreApproval = 65 - approvalPercentage;

  return {
    approvalPercentage,
    isReadyForFunding,
    needsMoreApproval: needsMoreApproval > 0 ? needsMoreApproval : 0,
    approvalWeight: grant?.approvalWeight,
    totalStaked,
  };
}

// Helper functions for formatting
export const formatStakeAmount = (amount: bigint | undefined): string => {
  if (!amount) return '0';
  return formatEther(amount);
};

export const formatGrantAmount = (amount: bigint | undefined): string => {
  if (!amount) return '0';
  return formatEther(amount);
};