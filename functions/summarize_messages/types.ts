import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ResultType = DefineType({
  name: "SummarizeMessagesResultType",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.types.string,
    },
    message: {
      type: Schema.types.string,
    },
  },
  required: ["channel_id", "message"],
});
