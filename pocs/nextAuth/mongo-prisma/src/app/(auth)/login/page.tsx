'use client';
import { loginCredentialsAction } from '@/actions/auth/cretentials';
import CardWrapper from '@/components/auth/card-wrapper';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    loginCredentialsAction(data).then((res) => {
      if (res?.error) {
        setError(res?.error);
      }
      setLoading(false);
    });
  };

  return (
    <div className="w-full px-10 sm:px-0 md:w-1/2 xl:w-1/4">
      <CardWrapper
        headerLabel="Log in to your account"
        title="Login"
        backButtonHref="/register"
        backButtonLabel="Don't have an account? Register here."
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
              <Button size="sm" variant="link" asChild className="px-0 font-normal">
                <Link href="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
            <FormError message={error} />
            <Button type="submit" className="w-full">
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default LoginPage;
