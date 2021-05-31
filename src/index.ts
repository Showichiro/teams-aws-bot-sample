import { APIGatewayEvent } from "aws-lambda";
import { Activity, CardFactory } from "botbuilder";
import { cloneDeep } from "lodash";
import * as httpm from "typed-rest-client/HttpClient";
import { IRequestOptions } from "typed-rest-client/Interfaces";

type Response = {
  statusCode: number;
};

export async function handler(event: APIGatewayEvent): Promise<Response> {
  const response: Response = {
    statusCode: 200,
  };
  if (!event.body) return response;
  const body = JSON.parse(event.body) as Activity;
  const authorization = process.env.authorization;
  const conversationId = body.conversation.id;
  const activityId = body.id;
  if (!activityId) return response;
  const uri = `v3/conversations/${conversationId}/activities/${activityId}`;
  const activity: Activity = cloneDeep(body);
  activity.attachments = [createCard()];
  activity.text = "";
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
  return {
    statusCode: 200,
  };
}

const createCard = () => {
  const adaptiveCard = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.0",
    type: "AdaptiveCard",
    speak:
      "Your flight is confirmed for you and 3 other passengers from San Francisco to Amsterdam on Friday, October 10 8:30 AM",
    body: [
      {
        type: "TextBlock",
        text: "Passengers",
        weight: "bolder",
        isSubtle: false,
      },
      {
        type: "TextBlock",
        text: "Sarah Hum",
        separator: true,
      },
      {
        type: "TextBlock",
        text: "Jeremy Goldberg",
        spacing: "none",
      },
      {
        type: "TextBlock",
        text: "Evan Litvak",
        spacing: "none",
      },
      {
        type: "TextBlock",
        text: "2 Stops",
        weight: "bolder",
        spacing: "medium",
      },
      {
        type: "TextBlock",
        text: "Fri, October 10 8:30 AM",
        weight: "bolder",
        spacing: "none",
      },
      {
        type: "ColumnSet",
        separator: true,
        columns: [
          {
            type: "Column",
            width: 1,
            items: [
              {
                type: "TextBlock",
                text: "San Francisco",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                size: "extraLarge",
                color: "accent",
                text: "SFO",
                spacing: "none",
              },
            ],
          },
          {
            type: "Column",
            width: "auto",
            items: [
              {
                type: "TextBlock",
                text: " ",
              },
              {
                type: "Image",
                url: "http://adaptivecards.io/content/airplane.png",
                size: "small",
                spacing: "none",
              },
            ],
          },
          {
            type: "Column",
            width: 1,
            items: [
              {
                type: "TextBlock",
                horizontalAlignment: "right",
                text: "Amsterdam",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                horizontalAlignment: "right",
                size: "extraLarge",
                color: "accent",
                text: "AMS",
                spacing: "none",
              },
            ],
          },
        ],
      },
      {
        type: "TextBlock",
        text: "Non-Stop",
        weight: "bolder",
        spacing: "medium",
      },
      {
        type: "TextBlock",
        text: "Fri, October 18 9:50 PM",
        weight: "bolder",
        spacing: "none",
      },
      {
        type: "ColumnSet",
        separator: true,
        columns: [
          {
            type: "Column",
            width: 1,
            items: [
              {
                type: "TextBlock",
                text: "Amsterdam",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                size: "extraLarge",
                color: "accent",
                text: "AMS",
                spacing: "none",
              },
            ],
          },
          {
            type: "Column",
            width: "auto",
            items: [
              {
                type: "TextBlock",
                text: " ",
              },
              {
                type: "Image",
                url: "http://adaptivecards.io/content/airplane.png",
                size: "small",
                spacing: "none",
              },
            ],
          },
          {
            type: "Column",
            width: 1,
            items: [
              {
                type: "TextBlock",
                horizontalAlignment: "right",
                text: "San Francisco",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                horizontalAlignment: "right",
                size: "extraLarge",
                color: "accent",
                text: "SFO",
                spacing: "none",
              },
            ],
          },
        ],
      },
      {
        type: "ColumnSet",
        spacing: "medium",
        columns: [
          {
            type: "Column",
            width: "1",
            items: [
              {
                type: "TextBlock",
                text: "Total",
                size: "medium",
                isSubtle: true,
              },
            ],
          },
          {
            type: "Column",
            width: 1,
            items: [
              {
                type: "TextBlock",
                horizontalAlignment: "right",
                text: "$4,032.54",
                size: "medium",
                weight: "bolder",
              },
            ],
          },
        ],
      },
    ],
  };
  return CardFactory.adaptiveCard(adaptiveCard);
};
