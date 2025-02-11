import db from "@/lib/database/db";
import { PADDLE_SUBSCRIPTION_WEBHOOK_SECRET_KEY } from "@/lib/env";
import paddle from "@/lib/paddle/config";
import { Hono } from "hono";
import { EventName } from "@paddle/paddle-node-sdk";
import { Subscription } from "@/lib/database/schema/subscription.model";

const paddleRoute = new Hono();

interface CustomData {
  customData: {
    entityType: string;
    customer: {
      id: string;
      email: string;
      entityType: "customer";
      extraStorageInByte: number;
      extraStorageInGB: number;
    };
  };
}

paddleRoute.post("paddle/subscription", async (c) => {
  try {
    await db();

    const signature = (c.req.header("paddle-signature") as string) || "";

    const rawRequestBody = await c.req.text();

    const secretKey = PADDLE_SUBSCRIPTION_WEBHOOK_SECRET_KEY;

    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature
      );
      if (eventData.eventType) {
        if (EventName.SubscriptionActivated) {
          const customData = (eventData.data as CustomData)?.customData;

          const userId = customData.customer.id;
          const extraStorageInByte = customData.customer.extraStorageInByte;

          await Subscription.updateOne(
            { subscriber: userId },
            {
              subscriptionType: "paid",
              status: "active",
              "gateway.paddle.subscription.id": eventData.data.id,
              "gateway.paddle.subscription.entityType": eventData.eventType,
              $inc: {
                selectedStorage: extraStorageInByte,
              },
            }
          );

          return c.json({}, { status: 200 });
        }

        if (EventName.SubscriptionCanceled) {
          const customData = (eventData.data as CustomData)?.customData;

          const userId = customData.customer.id;

          await Subscription.updateOne(
            { subscriber: userId },
            {
              status: "canceled",
              subscriptionType: "free",
              "gateway.paddle.subscription.entityType": eventData.eventType,
            }
          );

          return c.json({}, { status: 200 });
        }

        return c.json({}, { status: 200 });
      }
    }
    throw "Signature missing in header";
  } catch (error) {
    console.log("Error in verifying subscription webhook: ", error);

    return c.json({}, { status: 500 });
  }
});

export default paddleRoute