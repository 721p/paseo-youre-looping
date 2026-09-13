import { execFile } from "node:child_process";

import type { PluginHandlerContext } from "@getpaseo/plugin";
import type { output as ZodOutput } from "zod";

import { loopAgent } from "./loop.shared";

function stopAgent(agentId: string) {
  return new Promise<void>((resolve, reject) => {
    execFile("paseo", ["stop", agentId], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function runLoop(
  { agentId }: ZodOutput<typeof loopAgent.input>,
  { paseo }: PluginHandlerContext,
) {
  const agent = paseo.agents.ref(agentId);

  await agent.refresh();

  if (agent.activeTurn) {
    await stopAgent(agentId);
  }

  await agent.send("You're looping");

  return {
    ok: true,
  };
}