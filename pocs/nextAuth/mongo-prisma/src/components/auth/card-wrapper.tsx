'use client';

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import AuthHeader from './auth-header';
import { BackButton } from './back-button';
import { signInWithGoogle } from '@/actions/auth';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  title: string;
  showSocial?: boolean;
  backButtonHref: string;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  title,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <AuthHeader label={headerLabel} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col gap-y-2">
        <BackButton label={backButtonLabel} href={backButtonHref} />
        {showSocial && (
          <>
            <hr />
            <p className="text-muted-foreground text-center text-sm font-medium">
              Or continue with
            </p>
            <div className="flex items-center justify-center space-x-4">
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-md bg-sky-600 px-6 py-2 transition-transform duration-200 hover:bg-sky-500 text-secondary active:scale-95"
                >
                  Google
                </button>
              </form>
              {/* <button type="button" className="btn btn-primary btn-sm">
                GitHub
              </button> */}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
