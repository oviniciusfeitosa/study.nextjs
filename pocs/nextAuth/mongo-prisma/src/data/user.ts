'use server';

import database from '@/lib/database';

export async function getUserByEmail(email: string) {
  try {
    const lowerCaseEmail = email.toLowerCase();
    const user = await database.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
export async function getUserWithAccountsByEmail(email: string) {
  try {
    const lowerCaseEmail = email.toLowerCase();
    const user = await database.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
      include: { accounts: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function createUser(data: { name: string; email: string; image: string }) {
  const res = await database.user.create({
    data,
  });

  return res;
}

export const getUserById = async (id: string) => {
  try {
    const user = await database.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const updateUserEmailVerifiedById = async (id: string) => {
  try {
    return await database.user.update({
      where: {
        id,
      },
      data: {
        emailVerified: new Date(),
      },
    });
  } catch (error) {
    return null;
  }
};
