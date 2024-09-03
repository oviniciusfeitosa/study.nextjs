import { auth } from '@/auth';
import Link from 'next/link';
const HomePage = async () => {
  const session = await auth();
  return (
    <main className="flex flex-col items-center justify-center gap-4 pt-[10vh] text-white">
      <h1 className="rounded-sm bg-zinc-900 p-4 px-8 text-center text-2xl font-semibold">
        NextJS + MongoDB + Prisma + Cretendials Auth + Google Auth
      </h1>
      <section className="flex flex-col items-center justify-center gap-4 rounded-sm bg-zinc-900 p-12">
        <div className='w-full'>
          {session ? (
            `Logged as ${session.user.email}`
          ) : (
            <div className="flex w-full gap-4">
              <Link
                href="/login"
                // href="/sign-in"
                // href="/auth/signin"
                className="w-full rounded-sm bg-[hsl(191,52%,30%)] p-2 px-6 text-center hover:bg-[hsl(191,52%,35%)]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                // href="/auth/signup"
                className="w-full rounded-sm bg-[hsl(191,52%,30%)] p-2 px-6 text-center hover:bg-[hsl(191,52%,35%)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/dashboard"
          className="w-full rounded-sm bg-[hsl(191,52%,30%)] p-2 px-6 text-center hover:bg-[hsl(191,52%,35%)]"
        >
          Dashboard Page (Protected)
        </Link>
      </section>
    </main>
  );
  // const session = await auth();
  // if (!session) return notFound();
  // return (
  // 	<main className="h-screen w-full grid place-content-center gap-10">
  // 		<div className="size-24 rounded-full overflow-hidden">
  // 			{/* To use the image we have to configure hostname "lh3.googleusercontent.com", under images in the `next.config.mjs` */}
  // 			<Image src={session.user.image!} alt="profile picture" width={100} height={100} className="object-cover" />
  // 		</div>

  // 		<h1 className="text-3xl font-bold">Hello {session.user.name}</h1>

  // 		<form
  // 			action={async () => {
  // 				"use server";
  // 				await signOut();
  // 			}}
  // 		>
  // 			<button
  // 				type="submit"
  // 				className="bg-slate-500 px-6 py-2 rounded-md hover:bg-slate-600 active:scale-95 transition-transform duration-200"
  // 			>
  // 				Log Out
  // 			</button>
  // 		</form>
  // 	</main>
  // );
};
export default HomePage;
