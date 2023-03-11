# ChatGPT Slack Summarizer

A simple Slack Application to summarize your Slack conversations using the ChatGPT model, gpt-3.5-turbo.
Run it daily on the Slack's [Next-gen platform](https://api.slack.com/future) to have a better overview of your team!

To start, fork this repo and deploy it to your own Slack organization via [Slack CLI](https://api.slack.com/future/tools/cli).

## Prerequisites

1. Create an [OpenAI](https://platform.openai.com/) account and generate new API key from [here](https://platform.openai.com/account/api-keys).
2. Create new Slack App and retrive credentials from [here](https://api.slack.com/apps).
3. Setup the [Slack CLI](https://api.slack.com/future/tools/cli) locally and authenticate your machine.
4. Install [Deno](https://deno.land/manual@v1.31.2/getting_started/installation) according to your environment.

## Configurations

### 1. OpenAI API Key

For Local Development:

- Copy `.env.sample` as `.env`.
- Write down your own OpenAI API Key on `.env` file.
- `$ slack run` will automatically load `.env` file as runtime environment variables.

For Production Enritonment:

Run the command below to setup runtime environment variables.

```sh
$ slack env add OPENAI_API_TOKEN "MY_API_KEY"
```

### 2. Workflow Input Parameters

To trigger the workflow, you need to pass all of these input parameters.

- **channel_ids** (string[])
  - An array of Channel IDs to generate summaries from.
  - You can specify either Slack's internal channel ID (e.g. `C01XXXXXXXX`) or dieplayed channel names.
- **report_to** (string)
  - A Channel ID (e.g. `C01XXXXXXXX`) to post the summarized messages to.
- **timezone** (string)
  - Your local timezone (e.g. `Asia/Tokyo`).
  - By default, this app will target all the messages within 24 hours therefore you need to specify the right timezone value for your fit.

### 3. Permissions

This app requires these OAuth Permission Scopes to work ideally.
Please be sure to setup correct values.

- `channels:history`
- `channels:join`
- `channels:read`
- `chat:write`
- `chat:write.customize`
- `chat:write.public`
- `emoji:read`
- `links:read`
- `reactions:read`
- `usergroups:read`
- `users.profile:read`
- `users:read`
- `users:read.email`


## Triggers

You can create any call triggers to fit your needs.

**Tips**: This repository includes both [scheduled trigger](./triggers//scheduled.ts) and [webhook trigger](./triggers//webhook.ts) as go-to samples.


- Webhook call example

```sh
curl -X POST https://hooks.slack.com/triggers/XXXXXX/999999999/XXXXXXXXXXXXXXX --header "Content-Type: application/json; charset=utf-8" -d '{"channel_ids": ["C01XXXXXXXX", "C02XXXXXXXX"], "report_to": "C03XXXXXXXX", "timezone": "Asia/Tokyo"}'
```

