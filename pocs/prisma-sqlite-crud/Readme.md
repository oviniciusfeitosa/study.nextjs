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
          id        Int      @id @default(autoincrement())
          title     String   
          content   String?
          published Boolean  @default(true)
          createdAt DateTime @default(now())
          updatedAt DateTime @updatedAt
        }
      ```

  - Migrate database: `npx prisma migrate dev --name init`
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
    import Link from "next/link";
    import React from "react";
    import Item from "./item";

    const getPosts = async () => {
      const res = await fetch(`${process.env.BASE_URL}/api/post`, {
        next: { revalidate: 0 },
      });

      // Define the output to json, because if only res, it will return by any type
      if (!res.ok) {
        console.error("Failed to fetch posts", res.statusText);
        return { posts: [] };
      }

      const json = await res.json();
      return json;
    };

    const Page = async () => {
      const posts = await getPosts();

      return (
        <div className="w-[1200px] mx-auto py-20">
          <Link
            href={"/create"}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white"
          >
            Create
          </Link>
          <div className="grid grid-cols-3 gap-5 mt-8">
            {posts?.posts
              ?.map((post: any, i: number) => <Item key={i} post={post} />)
              .sort()
              .reverse()}
          </div>
        </div>
      );
    };

    export default Page;
  ```

- Update `next.config.mjs` file:

  ```mjs
  const nextConfig = {
    env: {
      BASE_URL: process.env.BASE_URL,
    },
  };

  export default nextConfig;
  ```

- Create `./src/app/create/page.tsx` file:

  ```typescript
    "use client"

    import { useRouter } from 'next/navigation'
    import React, { useState } from 'react'

    const Page = () => {
        const [title, setTitle] = useState('')
        const [content, setContent] = useState('')
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const router = useRouter()

        const handleSubmit = async (e: any) => {
            e.preventDefault()

            setIsLoading(true)

            // Because this is a client side (because we use 'use client on top'), so we don't have to add http in the api
            await fetch('/api/post', {
                method: 'POST', // Method put is to create
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, content
                })
            }).then((res) => {
                console.log(res)
            }).catch((e) => {
                console.log(e)
            })

            setIsLoading(false)
            router.push('/')
        }

        return (
            <form className='w-[500px] mx-auto pt-20 flex flex-col gap-2' onSubmit={handleSubmit}>
                <input type="text" placeholder='Input your title' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full border p-2 rounded-md' />
                <textarea rows={10} placeholder='Input your content' value={content} onChange={(e) => setContent(e.target.value)} className='w-full border p-2 rounded-md' />
                <button disabled={isLoading}>{isLoading ? 'Loading ...' : 'Submit'}</button>
            </form>
        )
    }

    export default Page

  ```

- Create `./src/app/update/page.tsx` file:

  ```typescript
    "use client"

    import { useRouter } from 'next/navigation'
    import React, { useEffect, useState } from 'react'

    const Page = ({ params }: { params: { id: string } }) => {

        // The update page will need an id in a url
        const id = params.id
        const [title, setTitle] = useState('')
        const [content, setContent] = useState('')
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const router = useRouter()

        const handleSubmit = async (e: any) => {
            e.preventDefault()

            setIsLoading(true)

            // Because this is a client side (because we use 'use client on top'), so we don't have to add http in the api
            await fetch('/api/post', {
                method: 'PUT', // Method put is to update
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, content, id
                })
            }).then((res) => {
                console.log(res)
            }).catch((e) => {
                console.log(e)
            })

            setIsLoading(false)

            router.push('/')
        }

        useEffect(() => {
            getData()
        }, [])

        const getData = async () => {
            const res = await fetch('/api/post/' + id)
            const json = await res.json()

            if (!json) {
                router.push('/404')
                return
            }

            setTitle(json.post.title)
            setContent(json.post.content)
        }

        return (
            <form className='w-[500px] mx-auto pt-20 flex flex-col gap-2' onSubmit={handleSubmit}>
                <input type="text" placeholder='Input your title' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full border p-2 rounded-md' />
                <textarea rows={10} placeholder='Input your content' value={content} onChange={(e) => setContent(e.target.value)} className='w-full border p-2 rounded-md' />
                <button disabled={isLoading}>{isLoading ? 'Loading ...' : 'Update'}</button>
            </form>
        )
    }

    export default Page
  ```

- Create `./src/app/api/post/route.ts` file:

  ```typescript
    import { PrismaClient } from "@prisma/client";
    import { NextRequest, NextResponse } from "next/server";

    const prisma = new PrismaClient();

    // Action to read
    export async function GET () {
      const posts = await prisma.post.findMany({});
      
      return NextResponse.json({
        posts,
      });
    };

    // Action to create
    export async function POST (req: NextRequest) {
      const { title, content } = await req.json();

      const post = await prisma.post.create({
        data: {
          title,
          content,
        },
      });

      return NextResponse.json({
        post,
      });
    };

    // Action to delete
    export async function DELETE (req: NextRequest) {
      const url = new URL(req.url).searchParams;
      const id = Number(url.get("id")) || 0;

      const post = await prisma.post.delete({
        where: {
          id: id,
        },
      });

      if (!post) {
        return NextResponse.json(
          {
            message: "Error",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({});
    };

    // Action to update or edit
    export async function PUT (req: NextRequest) {
      const { title, content, id } = await req.json();

      const post = await prisma.post.update({
        where: {
          id: Number(id),
        },

        data: {
          title,
          content,
        },
      });

      return NextResponse.json({
        post,
      });
    };
  ```

- Create `./src/app/api/post/[id]/route.ts` file:

  ```typescript
    import { PrismaClient } from "@prisma/client";
    import { NextRequest, NextResponse } from "next/server";

    const prisma = new PrismaClient();

    export const GET = async (
      req: NextRequest,
      context: { params: { id: string } }
    ) => {
      
      const id = Number(context.params.id || 0);

      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
      });

      return NextResponse.json({ post });
    };
  ```

## Reference

- [CRUD Tutorial Using Next.js (App Router), TypeScript, Prisma, PlanetScale, and TailwindCSS Part 1](https://medium.com/@irwantoalvin/crud-tutorial-using-next-js-app-router-typescript-prisma-planetscale-and-tailwindcss-part-1-a4b6687eecdf)
- [CRUD Tutorial Using Next.js (App Router), TypeScript, Prisma, PlanetScale, and TailwindCSS Part 2](https://medium.com/@irwantoalvin/crud-tutorial-using-next-js-app-router-typescript-prisma-planetscale-and-tailwindcss-part-2-ca5efb261953)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
