import { Activity } from "botbuilder";
import { cloneDeep } from "lodash";
import * as httpm from "typed-rest-client/HttpClient";
import { IRequestOptions } from "typed-rest-client/Interfaces";

export async function handler(event: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const body = JSON.parse(event.body) as Activity;
  const authorization = process.env.authorization;
  const conversationId = body.conversation.id;
  const activityId = body.id;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const uri = `v3/conversations/${conversationId}/activities/${activityId}`;
  const activity: Activity = cloneDeep(body);
  activity.from = cloneDeep(body.recipient);
  activity.recipient = cloneDeep(body.from);
  const options: IRequestOptions = {
    headers: {
      Authorization: authorization,
      "Content-type": "application/json; charset=utf-8",
    },
  };
  const client = new httpm.HttpClient("client", undefined, options);
  await client.post(body.serviceUrl + uri, JSON.stringify(activity));
}
