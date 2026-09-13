import {
  Icon,
  type PluginClientContext,
  type PluginComposerPillProps,
} from "@getpaseo/plugin";

import { Text, View } from "react-native";

import { loopAgent } from "./loop.shared";

function LoopIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Repeat icon */}
      <Icon
        name="Repeat2"
        size={16}
        color={color}
      />

      {/* Red X overlay */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <Icon
          name="X"
          size={16}
          color="#ef4444"
        />
      </View>
    </View>
  );
}

function LoopPill({ theme }: PluginComposerPillProps) {
  return (
    <>
      <LoopIcon color={theme.colors.foregroundMuted} />
    </>
  );
}

export function contributeClient(client: PluginClientContext) {
  const pills = new Map<string, () => void>();
  let disposed = false;

  function registerPill(agent: {
    id: string;
    workspaceId?: string | null;
  }) {
    if (!agent.workspaceId || disposed) {
      return;
    }

    const agentId = agent.id;
    const workspaceId = agent.workspaceId;

    // Remove an existing registration for this agent first.
    pills.get(agentId)?.();

    pills.set(
      agentId,
      client.addComposerPill({
        id: "youre-looping",
        title: "You're looping",
        workspaceId,
        agentId,
        Component: LoopPill,

        async onPress() {
          await client.rpc(loopAgent, {
            agentId,
          });
        },
      }),
    );
  }

  // Listen for future agent updates.
  const unsubscribe = client.paseo.agents.subscribe((update) => {
    if (update.kind === "upsert") {
      registerPill(update.agent);
    }
  });

  // Register the pill for agents that already exist.
  void client.paseo.agents
    .list({
      filter: {
        includeArchived: false,
      },
      subscribe: {
        subscriptionId: "youre-looping-agents",
      },
    })
    .then((result) => {
      if (disposed) {
        return;
      }

      for (const { agent } of result.entries) {
        registerPill(agent);
      }
    })
    .catch((error) => {
      console.error(
        "[youre-looping] failed to load agents",
        error,
      );
    });

  return () => {
    disposed = true;

    unsubscribe();

    for (const remove of pills.values()) {
      remove();
    }

    pills.clear();
  };
}