import { defineRpc } from "@getpaseo/plugin/server";
import { z } from "zod";

export const loopAgent = defineRpc({
  name: "youre-looping.run",

  input: z.object({
    agentId: z.string(),
  }),

  output: z.object({
    ok: z.boolean(),
  }),
});