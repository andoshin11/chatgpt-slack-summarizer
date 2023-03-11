import { Trigger } from "deno-slack-api/types.ts";
import SummarizeWorkflow from "../workflows/summarize.ts";

// const trigger: Trigger<(typeof SummarizeWorkflow)["definition"]> = {
//   type: "webhook",
//   name: "sample webhook trigger",
//   workflow: `#/workflows/${SummarizeWorkflow.definition.callback_id}`,
//   inputs: {
//     channel_ids: {
//       value: "{{data.channel_ids}}",
//     },
//     report_to: {
//       value: "{{data.report_to}}",
//     },
//     timezone: {
//       value: "{{data.timezone}}",
//     },
//   },
// };

const trigger: Trigger<(typeof SummarizeWorkflow)["definition"]> = {
  type: "scheduled",
  name: "sample scheduled trigger",
  workflow: `#/workflows/${SummarizeWorkflow.definition.callback_id}`,
  inputs: {
    channel_ids: {
      value: ["C01XXXXXXXX", "C02XXXXXXXX"],
    },
    report_to: {
      value: "C01XXXXXXXX",
    },
    timezone: {
      value: "Asia/Tokyo",
    },
  },
  schedule: {
    start_time: "2023-03-10T09:00:00.000Z",
    timezone: "Asia/Tokyo",
    frequency: {
      type: "weekly",
      on_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
};

export default trigger;
