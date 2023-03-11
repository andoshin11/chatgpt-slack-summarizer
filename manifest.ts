import { Manifest } from "deno-slack-sdk/mod.ts";
import SummarizeWorkflow from "./workflows/summarize.ts";
import { ResultType as CollectMessageResultType } from "./functions/collect_messages/types.ts";
import { ResultType as SummarizeMessageResultType } from "./functions/summarize_messages/types.ts";

export default Manifest({
  name: "chatgpt-slack-summarizer",
  description: "Summarize Slack conversations using OpenAI",
  displayName: "Slack Summarizer",
  icon: "assets/openai.svg",
  outgoingDomains: ["api.openai.com"],
  types: [CollectMessageResultType, SummarizeMessageResultType],
  workflows: [
    SummarizeWorkflow,
  ],
  botScopes: [
    "channels:history",
    "channels:join",
    "channels:read",
    "chat:write",
    "chat:write.customize",
    "chat:write.public",
    "emoji:read",
    "links:read",
    "reactions:read",
    "usergroups:read",
    "users.profile:read",
    "users:read",
    "users:read.email",
  ],
});
