import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CollectMessagesFunctionDefinition } from "../functions/collect_messages/definition.ts";
import { SummarizeMessagesFunctionDefinition } from "../functions/summarize_messages/definition.ts";
import { SendSummaryFunctionDefinition } from "../functions/send_summary/definition.ts";

const SummarizeWorkflow = DefineWorkflow({
  callback_id: "summarize",
  title: "Summarize Slack messages using ChatGPT",
  description: "Send conversation summary to Slack with ChatGPT",
  input_parameters: {
    properties: {
      channel_ids: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
      },
      report_to: {
        type: Schema.slack.types.channel_id,
      },
      timezone: {
        type: Schema.types.string,
      },
    },
    required: ["channel_ids", "report_to", "timezone"],
  },
});

const collectMessagesStep = SummarizeWorkflow.addStep(
  CollectMessagesFunctionDefinition,
  {
    channel_ids: SummarizeWorkflow.inputs.channel_ids,
    timezone: SummarizeWorkflow.inputs.timezone,
  },
);

const summarizeMessagesStep = SummarizeWorkflow.addStep(
  SummarizeMessagesFunctionDefinition,
  {
    data: collectMessagesStep.outputs.results,
  },
);

const _sendMessagesStep = SummarizeWorkflow.addStep(
  SendSummaryFunctionDefinition,
  {
    data: summarizeMessagesStep.outputs.results,
    report_to: SummarizeWorkflow.inputs.report_to,
  },
);

export default SummarizeWorkflow;
