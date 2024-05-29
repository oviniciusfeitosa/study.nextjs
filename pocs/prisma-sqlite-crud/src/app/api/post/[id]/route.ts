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