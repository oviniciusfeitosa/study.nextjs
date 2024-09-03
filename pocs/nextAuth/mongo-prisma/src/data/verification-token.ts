import database from '@/lib/database';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await database.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await database.verificationToken.findFirst({
      where: {
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
