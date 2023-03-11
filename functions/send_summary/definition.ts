import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ResultType as SummarizeMessagesResultType } from "../summarize_messages/types.ts";

export const SEND_SUMMARY_FUNCTION_CALLBACK_ID = "send_summary";

export const SendSummaryFunctionDefinition = DefineFunction({
  callback_id: SEND_SUMMARY_FUNCTION_CALLBACK_ID,
  title: "Send a summmary to Slack channel",
  source_file: "functions/send_summary/handler.ts",
  input_parameters: {
    properties: {
      data: {
        type: Schema.types.array,
        items: {
          type: SummarizeMessagesResultType,
        },
      },
      report_to: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["data", "report_to"],
  },
});
