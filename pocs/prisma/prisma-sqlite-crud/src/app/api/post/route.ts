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