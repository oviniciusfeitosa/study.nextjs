# Readme

## what was done

```sh
npx create-next-app@latest nextjs-google-auth
cd nextjs-google-auth
pnpm add next-auth@beta @prisma/client @auth/prisma-adapter
pnpm add -D prisma
```

- Access `https://cloud.mongodb.com/` to get your connection string
- Create a new database  `mydb` on cluster
- Get connection string
- Define a MONGODB `DATABASE_URL` inside `.env` file. E.g.: `DATABASE_URL="mongodb+srv://root:randompassword@cluster0.ab1cd.mongodb.net/mydb?retryWrites=true&w=majority"`
- [Set Up Google Auth Credentials](https://next-auth.js.org/providers/google)
  - We will need a Google Auth Client ID and Client Secret. To generate these credentials:
  - Go to the [Google Cloud Console](https://console.developers.google.com/apis/credentials)
  - Register a new application and create OAuth 2.0 credentials.
    - Authorized Javascript origins: `http://localhost:3000`
    - Authorized redirect URIs:
      - For production: `https://{YOUR_DOMAIN}/api/auth/callback/google`
      - For development: `http://localhost:3000/api/auth/callback/google`
- Generate an Auth Secret: 
  - Run the following command to generate a secret for authentication: `npx auth secret`
  - Add the generated secret to your .env file: `NEXTAUTH_SECRET="your-auth-secret"`
- Prisma
  - Initialize Prisma: `pnpm exec prisma init --datasource-provider mongodb`
  - Push to the database: `pnpm exec prisma db push`
  - Access database: `pnpm exec prisma studio`
- Create the files bellow:
  - `@/lib/db.ts`
  - `@/lib/auth.config.ts`
  - `@/auth.ts`
  - `@/app/api/auth/[...nextauth]/route.ts`
  - `@/routes.ts`
  - `@/middleware.ts`
  - `@/app/login/page.tsx`
  - `@/app/page.tsx`
- Run the development server: `npm run dev`
<!-- - `pnpm add -D lucia oslo prisma`
- `pnpm install @lucia-auth/adapter-prisma`
- `npx prisma init --datasource-provider mongodb`
- Define User and Account model on `prisma/schema.prisma`:

  ` ``prisma
  datasource db {
    provider = "mongodb"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }

  model User {
    id            String    @id @default(auto()) @map("_id") @db.ObjectId
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    accounts      Account[]
  }

  model Account {
    id                String   @id @default(auto()) @map("_id") @db.ObjectId
    userId            String   @db.ObjectId
    type              String
    provider          String
    providerAccountId String
    refresh_token     String?  @db.String
    access_token      String?  @db.String
    expires_at        Int?
    token_type        String?
    scope             String?
    id_token          String?  @db.String
    session_state     String?
    createdAt         DateTime @default(now())
    updatedAt         DateTime @updatedAt
    user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([provider, providerAccountId])
  }
  ` ``

- `npx prisma generate`
- `npx prisma db push`
- Access `https://cloud.mongodb.com/` to get your connection string
- Define a MONGODB `DATABASE_URL` inside `.env` file. E.g.: `DATABASE_URL="mongodb+srv://root:randompassword@cluster0.ab1cd.mongodb.net/mydb?retryWrites=true&w=majority"`
- Create `@/lib/db.ts` file:

  ` ``ts
  import { PrismaClient } from "@prisma/client";

  const prismaClientSingleton = () => {
    return new PrismaClient();
  };

  declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
  }

  const db = globalThis.prisma ?? prismaClientSingleton();

  export default db;

  if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
  ` `` -->

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Known Issues

- Avoid `…` instead `...`

## References

- [\[Next.js14\] NextAuth v5 (3) — Google Sign In](https://medium.com/@youngjun625/next-js14-nextauth-v5-3-google-sign-in-3683d8fae69c)
  - [Github source code](https://github.com/youngjun625/nextauth14-nextauthv5)
- [Prisma - Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [Implementing Google Authentication in a NextJS 14 Application with AuthJS 5, MongoDB, and Prisma ORM](https://medium.com/@sazzadur/implementing-google-authentication-in-a-nextjs-14-application-with-authjs-5-mongodb-and-prisma-bbfcb38b3eea)
- [Autenticação NextAuth com Google | Next.js 14+](https://www.youtube.com/watch?v=avSIzMivb6U)
- [bwestwood11/verification-email-token-authjs - Github repo](https://github.com/bwestwood11/verification-email-token-authjs)