This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## History

- Install sqlite3: `npm install sqlite3`
- Install prisma: `npm install prisma --save-dev`
- Create prisma schema: `npx prisma init --datasource-provider sqlite`
- Configure prisma environment:
  - Open: `.env`
  - Set: `DATABASE_URL="file:./dev.db"`
- Create `prisma/dev.db` file: `touch prisma/dev.db`
- Migrations
  - Create data model
    - Open: `prisma/schema.prisma`
    - Then set:

      ```prisma
        datasource db {
          provider = "sqlite"
          url = env("DATABASE_URL")
        }

        model Post {
          id      String   @id @default(cuid())
          name    String
        }
      ```

  - Migrate database: `npx prisma db push`
- Generate prisma client: `npx prisma generate`
- Prisma Studio: `npx prisma studio`
  - Check the database with Prisma Studio: `npx prisma studio`
  - Then access: <http://localhost:5555>
  - Create a new record
- Create `src/lib/prisma.ts` file:

  ```typescript
    import { PrismaClient } from '@prisma/client';

    const prismaClientSingleton = () => {
      return new PrismaClient();
    };

    declare global {
      var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
    }

    export const prisma = globalThis.prisma ?? prismaClientSingleton();

    if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
  ```

- Create `src/app/page.tsx` file:

  ```typescript
    import { prisma } from '@/lib/prisma';

    const Home = async () => {
      const posts = await prisma.post.findMany();

      return (
        <div className="p-4 flex flex-col gap-y-4">
          <h2>Home</h2>

          <ul className="flex flex-col gap-y-2">
            {posts.map((post) => (
              <li key={post.id}>{post.name}</li>
            ))}
          </ul>
        </div>
      );
    };

    export default Home;
  ```

## Reference

- [Next.js with Prisma and SQLite](https://www.robinwieruch.de/next-prisma-sqlite/)
