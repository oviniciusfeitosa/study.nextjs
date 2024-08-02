import { headers } from "next/headers";
import { Webhook, type WebhookRequiredHeaders } from "svix";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
async function handler(request: Request) {
  const payload = await request.json();
  const headerList = headers();
  const heads = {
    "svix-id": headerList.get("svix-id"),
    "svix-timestamp": headerList.get("svix-timestamp"),
    "svix-signature": headerList.get("svix-signature"),
  };
  // const wh = new Webhook(, heads);
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: Event | null = null;
  try {
    event = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (error) {
    console.error((error as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = event.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = event.data;
    console.log("id", id);
    console.log("attributes", attributes);
    await prisma.user.upsert({
      where: {
        externalId: id as string,
      },
      create: {
        externalId: id as string,
        attributes,
      },
      update: {
        attributes,
      },
    });
  }

  // to show all clerk users:
  //clerkClient.users.getUserList()
}

type EventType = "user.created" | "user.updated" | "*";
type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};
export const GET = handler;
export const POST = handler;
export const PUT = handler;
