import { SlackFunction } from "deno-slack-sdk/mod.ts";
import type { KnownBlock } from "npm:@slack/types";
import { SendSummaryFunctionDefinition } from "./definition.ts";

export default SlackFunction(
  SendSummaryFunctionDefinition,
  async ({ client, inputs }) => {
    console.log("inside send summary");
    console.log(inputs);
    const { data, report_to } = inputs;

    const blocks: KnownBlock[] = [];

    for (const { channel_id, message } of data) {
      blocks.push(
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `----\n<#${channel_id}>\n`,
          },
        },
      );
      blocks.push(
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${message}>\n\n`,
          },
        },
      );
    }

    console.log(blocks);

    if (blocks.length) {
      await client.chat.postMessage({
        channel: report_to,
        blocks,
      });
    }

    return { completed: true, error: undefined, outputs: {} };
  },
);
