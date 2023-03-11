import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import type { BaseResponse } from "deno-slack-api/types.ts";
import type { Channel } from "npm:@slack/web-api/dist/response/ConversationsListResponse";
import type { Member } from "npm:@slack/web-api/dist/response/UsersListResponse";
import type { Message } from "npm:@slack/web-api/dist/response/ChannelsHistoryResponse";
import type { Usergroup } from "npm:@slack/web-api/dist/response/UsergroupsListResponse";
import { CollectMessagesFunctionDefinition } from "./definition.ts";

const user_regex = /<@([A-Z0-9]+)>/g;
const usergroup_regex = /<!subteam\^([A-Z0-9]+)\|@.*>/g;
const emoji_regex = /:[-_a-zA-Z0-9]+?:/g;

export default SlackFunction(
  CollectMessagesFunctionDefinition,
  async ({ client, inputs }) => {
    console.log("inside collect messages");
    console.log(inputs);
    const { channel_ids, timezone } = inputs;

    if (!channel_ids.length) {
      return { completed: true, error: undefined, outputs: { results: [] } };
    }

    const { channels } = (await client.conversations.list({
      exclude_archived: true,
      limit: 9999,
    })) as BaseResponse & { channels?: Channel[] };
    const targetChannels = (channels || []).filter((c) =>
      channel_ids.includes(c.id!) || channel_ids.includes(c.name!)
    );

    const now = timezone ? datetime().toZonedTime(timezone) : datetime();
    const day = now.format("wwww");
    const subDays = day === "Monday" ? 3 : day === "Saturday" ? 2 : 1;
    const historyStartAt = now.subtract({ day: subDays });

    const { members } = (await client.users.list()) as BaseResponse & {
      members?: Member[];
    };
    const membersById = (members || []).reduce(
      (acc, ac) => (acc[ac.id!] = ac, acc),
      {} as { [memberId: string]: Member },
    );
    const { usergroups } = (await client.usergroups.list()) as BaseResponse & {
      usergroups?: Usergroup[];
    };
    const userGroupsById = (usergroups || []).reduce(
      (acc, ac) => (acc[ac.id!] = ac, acc),
      {} as { [userGroupId: string]: Usergroup },
    );

    const results = await Promise.all(targetChannels.map(async (channel) => {
      console.log(`Fetching messsages from: ${channel.id}`);
      const { messages } = (await client.conversations.history({
        channel: channel.id,
        oldest: historyStartAt.format("X"),
      })) as BaseResponse & { messages?: Message[] };

      const formattedMessages = (messages || []).filter((m) =>
        !m.bot_id && !!m.text
      )
        .reverse()
        .map((m) => {
          let text = m.text!;
          text = text.replace(user_regex, (_, g1) => {
            return membersById[g1 as any].real_name ||
              membersById[g1 as any].name || "";
          });
          text = text.replace(usergroup_regex, (_, g1) => {
            return userGroupsById[g1 as any].name || "";
          });
          text = text.replaceAll(emoji_regex, "");
          text = text.replaceAll("\n", "\\n");
          return `${
            membersById[m.user!].real_name || membersById[m.user!].name
          } : ${text}`;
        });

      return {
        channel_id: channel.id!,
        messages: formattedMessages,
      };
    }));
    console.log(results);

    return { completed: true, error: undefined, outputs: { results } };
  },
);
