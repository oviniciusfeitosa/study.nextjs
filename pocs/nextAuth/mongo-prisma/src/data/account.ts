'use server';

import database from '@/lib/database';

export async function getAccountByUserEmail(email: string) {
  try {
    const user = await database.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.accounts;
  } catch (error) {
    console.error('Error fetching account by user email:', error);
    throw error;
  } finally {
    await database.$disconnect();
  }
}