'use client';

import { resetPasswordByTokenCredentialsAction } from '@/actions/auth/credentials/email';
import CardWrapper from '@/components/auth/card-wrapper';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
      // token: '',
      token: token || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);
    resetPasswordByTokenCredentialsAction(data).then((res) => {
      if ('success' in res) {
        setSuccess(res.success);
      } else if ('error' in res) {
        setError(res.error);
      }
      setLoading(false);
    });
  };

  const onLoad = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('No token found');
      return;
    }

  }, [token, success, error]);

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <CardWrapper
        headerLabel="Reset password"
        title="Define a new password"
        backButtonHref="/login"
        backButtonLabel="Back to login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="hidden" />
                      {/* {JSON.stringify(field)} */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Send'}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}

export default ResetPasswordPage



