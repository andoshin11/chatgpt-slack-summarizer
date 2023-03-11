import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ResultType } from "./types.ts";

export const COLLECT_MESSAGES_FUNCTION_CALLBACK_ID = "collect_messages";

export const CollectMessagesFunctionDefinition = DefineFunction({
  callback_id: COLLECT_MESSAGES_FUNCTION_CALLBACK_ID,
  title: "Collect messages from target channels",
  source_file: "functions/collect_messages/handler.ts",
  input_parameters: {
    properties: {
      channel_ids: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "Target channel ids to retrive messages from.",
      },
      timezone: {
        type: Schema.types.string,
      },
    },
    required: ["channel_ids", "timezone"],
  },
  output_parameters: {
    properties: {
      results: {
        type: Schema.types.array,
        items: {
          type: ResultType,
        },
      },
    },
    required: ["results"],
  },
});
