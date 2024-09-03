'use client';

import { activateCredentialsEmail } from '@/actions/auth/credentials/email';
import CardWrapper from '@/components/auth/card-wrapper';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const VerifyEmailPage = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('No token provided');
      return;
    }

    activateCredentialsEmail(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
        }
        if (data.error) {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError('An unexpected error occurred');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <div>
      <CardWrapper
        headerLabel="Confirming your email address"
        title="Confirming now..."
        // backButtonHref="/auth/login"
        backButtonHref="/login"
        backButtonLabel="Back to login"
      >
        <div className="flex w-full items-center justify-center">
          {!success && !error && <p>Loading</p>}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      </CardWrapper>
    </div>
  );
}

export default VerifyEmailPage



