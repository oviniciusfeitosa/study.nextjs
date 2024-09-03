'use client';
import { sendResetPasswordCredentialsAction } from "@/actions/auth/credentials/email";
import CardWrapper from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from '@/components/auth/form-success';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ForgotPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ForgotPasswordPage = () => {

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setLoading(true);
    sendResetPasswordCredentialsAction(data).then((res) => {
      if ('success' in res) {
        setSuccess(res.success);
      } else if ('error' in res) {
        setError(res.error);
      }
      setLoading(false);
    });
    // try {
    //   const response = await fetch('/api/auth/reset-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error('There was an error sending the reset password email.');
    //   }

    //   const responseData = await response.json()

    //   if ('success' in responseData) {
    //     setSuccess(responseData.success);
    //   } else if ('error' in responseData) {
    //     setError(responseData.error);
    //   }
    // } catch (error: any) {
    //   setError(error.message || 'Failed to send reset password email.');
    // }
  };

  return (
    <div className="xl:w-1/4 md:w-1/2 w-full px-10 sm:px-0">
    <CardWrapper
      headerLabel="Recover your password"
      title="Forgot password"
      backButtonHref="/login"
      backButtonLabel="Already remembered your password? Login here."
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="oviniciusfeitosa@email.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          
          <Button type="submit" className="w-full">
            {loading ? 'Loading...' : 'Send'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
    </div>
  );
}

export default ForgotPasswordPage