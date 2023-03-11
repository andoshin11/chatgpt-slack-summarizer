import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { SummarizeMessagesFunctionDefinition } from "./definition.ts";

export default SlackFunction(
  SummarizeMessagesFunctionDefinition,
  async ({ inputs, env }) => {
    console.log("inside summarize messages");
    console.log(inputs);
    const { data } = inputs;

    async function summarize(message: string) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_TOKEN}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: [
                  'The chat log format consists of one line per message in the format "Speaker : Message".',
                  "The `\\n` within the message represents a line break.",
                  "The user understands Japanese only.",
                  "So, The assistant need to speak in Japanese.",
                ].join("\n"),
              },
              {
                role: "user",
                content: [
                  "Please meaning summarize the following chat log to flat bullet list in Japanese.",
                  "It isn't line by line summary.",
                  "Do not include greeting/salutation/polite expressions in summary.",
                  "With make it easier to read.",
                  "Write in Japanese.",
                  "",
                  message,
                ].join("\n"),
              },
            ],
          }),
        });

        const json = await res.json();
        return json?.choices[0]?.message?.content as string;
      } catch (e) {
        console.log(e);
      }
    }

    const results = await Promise.all(
      data.map(async ({ messages, channel_id }) => {
        const summarizedMessages = await summarize(messages.join("\n"));
        return { channel_id, message: summarizedMessages || "" };
      }),
    );

    return { completed: true, error: undefined, outputs: { results } };
  },
);
