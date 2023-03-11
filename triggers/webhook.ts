import { Trigger } from "deno-slack-api/types.ts";
import SummarizeWorkflow from "../workflows/summarize.ts";

const trigger: Trigger<(typeof SummarizeWorkflow)["definition"]> = {
  type: "webhook",
  name: "sample webhook trigger",
  workflow: `#/workflows/${SummarizeWorkflow.definition.callback_id}`,
  inputs: {
    channel_ids: {
      value: "{{data.channel_ids}}",
    },
    report_to: {
      value: "{{data.report_to}}",
    },
    timezone: {
      value: "{{data.timezone}}",
    },
  },
};

export default trigger;
