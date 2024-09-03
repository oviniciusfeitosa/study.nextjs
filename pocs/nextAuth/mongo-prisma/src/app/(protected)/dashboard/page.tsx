import { auth } from '@/auth';
import { SubmitButton } from '@/components/SubmitButton';
import { authSignOut } from '@/actions/auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  if (!session) return notFound();

  return (
    <main className="flex flex-col items-center justify-center gap-4 pt-[10vh] text-white">
      <Link href="/" className="rounded-lg bg-[hsl(0,0%,7%)] p-2 px-8 hover:bg-[hsl(0,0%,10%)]">
        {'<'} Home
      </Link>
      <section className="flex flex-col items-center justify-center gap-4 rounded-sm bg-zinc-900 p-8">
        {session.user.image && (
          <div className="size-24 overflow-hidden rounded-full">
            {/* To use the image we have to configure hostname "lh3.googleusercontent.com", under images in the `next.config.mjs` */}
            <Image
              src={session.user.image}
              alt="profile picture"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold">Hello {session.user.name}</h1>

        <p>Hello {JSON.stringify(session?.user?.email)}</p>
        <form action={authSignOut}>
          <SubmitButton
            pendingText="Signing out..."
            className="mt-4 rounded-sm bg-[hsl(191,52%,30%)] p-2 px-4 hover:bg-[hsl(191,52%,35%)]"
          >
            Sign Out
          </SubmitButton>
        </form>
      </section>
    </main>
  );
};

export default DashboardPage;
