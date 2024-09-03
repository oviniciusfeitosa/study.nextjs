// import { sendResetPasswordCredentialsAction } from '@/actions/auth/credentials/email';
// import database from '@/lib/database';
// import { NextRequest } from 'next/server';

// export const POST = async (request: NextRequest) => {
//   const { email } = await request.json();

//   const result = await sendResetPasswordCredentialsAction(email);

//   return new Response(
//     JSON.stringify(result),
//     {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     },
//   );
// };
