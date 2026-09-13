import type { PluginClientContext } from "@getpaseo/plugin/client";

import { contributeClient } from "./client/loop";

export default function contribute(client: PluginClientContext) {
  return contributeClient(client);
}
