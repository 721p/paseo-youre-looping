import type { PluginContext } from "@getpaseo/plugin";

import { contributeClient } from "./loop.client";
import { runLoop } from "./loop.server";
import { loopAgent } from "./loop.shared";

export default function contribute(plugin: PluginContext) {
  plugin.handle(loopAgent, runLoop);
  plugin.addClientSide(contributeClient);

  return () => {};
}