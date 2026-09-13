import type { PluginServerContext } from "@getpaseo/plugin/server";

import { runLoop } from "./server/loop";
import { loopAgent } from "./shared/loop";

export default function contribute(server: PluginServerContext) {
  server.handle(loopAgent, runLoop);

  return () => {};
}
