import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ResultType } from "./types.ts";
import { ResultType as CollectMessagesResultType } from "../collect_messages/types.ts";

export const SUMMARIZE_MESSAGES_FUNCTION_CALLBACK_ID = "summarize_messages";

export const SummarizeMessagesFunctionDefinition = DefineFunction({
  callback_id: SUMMARIZE_MESSAGES_FUNCTION_CALLBACK_ID,
  title: "Summarize messages using ChatGPT",
  source_file: "functions/summarize_messages/handler.ts",
  input_parameters: {
    properties: {
      data: {
        type: Schema.types.array,
        items: {
          type: CollectMessagesResultType,
        },
      },
    },
    required: ["data"],
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
