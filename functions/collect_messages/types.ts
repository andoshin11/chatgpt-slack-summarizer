import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const ResultType = DefineType({
  name: "CollectMessagesResultType",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.types.string,
    },
    messages: {
      type: Schema.types.array,
      items: {
        type: Schema.types.string,
      },
    },
  },
  required: ["channel_id", "messages"],
});
