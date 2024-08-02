- clone `https://github.com/kavinvalli/clerk-auth.git` repository
- `pnpm add prisma @prisma/client svix`
- `npx prisma init`
  > will create `prisma/schema.prisma` file

- change `prisma/schema.prisma` to:

```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    // provider = "postgresql"
    provider = "mysql"
    url      = env("DATABASE_URL")
  }

  model User {
    id Int @id @default(autoincrement())
    externalId String @unique
    attributes Json
    createdAt  DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
```

- Add `DATABASE_URL` to .env file
  <!-- > `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres` -->
  > `DATABASE_URL="mysql://root:root@127.0.0.1:3306/clerklocaldb"`
- Run local docker mysql: `docker run --name clerk-mysqlq -v "$PWD/mysql/data":/var/lib/mysql -e 1000:1000 -e MYSQL_ROOT_PASSWORD="root" -p 3306:3306 -d mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci`
- Add `mysql/` folder to `.gitignore`
- `pnpm prisma db push`
- `pnpm prisma generate`
- `pnpm prisma studio`
- Create `app/api/webhooks/user/route.ts` file

```typescript
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
      /**
       *  id user_2k6tN8Kohd7JPhtmY2NO1CVxXq9
          attributes {
            backup_code_enabled: false,
            banned: false,
            create_organization_enabled: true,
            created_at: 1722615810800,
            delete_self_enabled: true,
            email_addresses: [
              {
                created_at: 1722615809025,
                email_address: 'viniciusfesil@gmail.com',
                id: 'idn_2k6tMwd6TEMIVic8MKNz8PfVy2T',
                linked_to: [Array],
                object: 'email_address',
                reserved: false,
                updated_at: 1722615810843,
                verification: [Object]
              }
            ],
            external_accounts: [
              {
                approved_scopes: 'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
                created_at: 1722615809012,
                email_address: 'viniciusfesil@gmail.com',
                family_name: 'Feitosa',
                given_name: 'Vinicius',
                google_id: '107165936821931823834',
                id: 'idn_2k6tMzwYVO1uSoeqIC1vRXpbyh8',
                label: null,
                object: 'google_account',
                picture: 'https://lh3.googleusercontent.com/a/ACg8ocIdYNbhJi4irbTPcGITt_h_TyAC8E8qrDbsDdHO64Mu07tKBzDy=s1000-c',
                public_metadata: {},
                updated_at: 1722615809012,
                username: null,
                verification: [Object]
              }
            ],
            external_id: null,
            first_name: 'Vinicius',
            has_image: true,
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yazZ0TjVuR0JFR3dUWDZDcnBlak1MdVU1ZEwifQ',
            last_active_at: 1722615810797,
            last_name: 'Feitosa',
            last_sign_in_at: null,
            locked: false,
            lockout_expires_in_seconds: null,
            mfa_disabled_at: null,
            mfa_enabled_at: null,
            object: 'user',
            passkeys: [],
            password_enabled: false,
            phone_numbers: [],
            primary_email_address_id: 'idn_2k6tMwd6TEMIVic8MKNz8PfVy2T',
            primary_phone_number_id: null,
            primary_web3_wallet_id: null,
            private_metadata: {},
            profile_image_url: 'https://images.clerk.dev/oauth_google/img_2k6tN5nGBEGwTX6CrpejMLuU5dL',
            public_metadata: {},
            saml_accounts: [],
            totp_enabled: false,
            two_factor_enabled: false,
            unsafe_metadata: {},
            updated_at: 1722615810875,
            username: null,
            verification_attempts_remaining: 100,
            web3_wallets: []
          }
      */
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
```

- `ngrok http 3000`
  - get `Forwarding`: `https://asdasdasd.....ngrok-free.app`
- Set Clerk webhook endpoint: "Webhooks > Endpoints > + Add endpoint" : `https://asdasdasd.....ngrok-free.app/api/hello/webhooks/user`
- Get "Signing secret": `whsec_CxHfWIHllSQBDTFn1XE+FMcsGUwTzj/s`
- Then add to `.env` file as: `WEBHOOK_SECRET="whsec_CxHfWIHllSQBDTFn1XE+FMcsGUwTzj/s"`
- Create `lib/db.ts` file for prisma

```typescript
  import { PrismaClient } from "@prisma/client";

  const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
  };

  export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

  if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

## Reference

- Svix Webhooks: <https://docs.svix.com/reference/webhooks>
