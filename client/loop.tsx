import {
  type PluginButtonIconProps,
  type PluginButtonRegistration,
  type PluginClientContext,
} from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/react-native";

import { View } from "react-native";

import { loopAgent } from "../shared/loop";

function LoopIcon({ color, size }: PluginButtonIconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Repeat icon */}
      <Icon
        name="Repeat2"
        size={size}
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
          size={size}
          color="#ef4444"
        />
      </View>
    </View>
  );
}

export function contributeClient(client: PluginClientContext) {
  const pills = new Map<string, PluginButtonRegistration>();
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

    // Replace an existing registration for this agent.
    pills.get(agentId)?.remove();

    pills.set(
      agentId,
      client.addComposerPill({
        id: "youre-looping",
        workspaceId,
        agentId,
        button: {
          title: "You're looping",
          icon: LoopIcon,

          behavior: {
            kind: "action",

            async onPress() {
              await client.rpc(loopAgent, {
                agentId,
              });
            },
          },
        },
      }),
    );
  }

  function removePill(agentId: string) {
    pills.get(agentId)?.remove();
    pills.delete(agentId);
  }

  // Listen for future agent updates.
  const unsubscribe = client.paseo.agents.subscribe((update) => {
    if (update.kind === "upsert") {
      registerPill(update.agent);
      return;
    }

    if (update.kind === "remove") {
      removePill(update.agentId);
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

    for (const pill of pills.values()) {
      pill.remove();
    }

    pills.clear();
  };
}
