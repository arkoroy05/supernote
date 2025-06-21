'use client'

import { StakingCard } from "./StakingCard";
import { GrantRequestCard } from "./GrantRequestCard";
import { GrantsList } from "./GrantsList";
import { StakingStats } from "./StakingStats";
import { StakersList } from "./StakersList";
import { useAccount, useConnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function IdeaAcceleratorDashboard() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Idea Accelerator</h1>
        <p className="text-muted-foreground">Connect your wallet to get started</p>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            Connect {connector.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Community Overview</h1>
        <StakingStats />
      </div>

      <Tabs defaultValue="grants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
        </TabsList>

        <TabsContent value="grants" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <GrantRequestCard />
          </div>
          <GrantsList />
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <StakingCard />
          </div>
          <StakersList />
        </TabsContent>
      </Tabs>
    </div>
  );
} 