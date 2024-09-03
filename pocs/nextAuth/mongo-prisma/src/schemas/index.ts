import * as z from 'zod';
const { object, string } = z;

export const LoginSchema = object({
  email: string({ required_error: 'Email is required' }).email(
    'Please enter a valid email address',
  ),
  password: string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});
export type LoginValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = object({
  email: string({ required_error: 'Email is required' }).email(
    'Please enter a valid email address',
  ),
  password: string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirmation: z.string().min(6, {
      message: "Password must be at least 6 characters long."
  }),
  // username: string({ required_error: "Username is required" })
  //   .min(4, "Username is required")
  //   .max(32, "Username must be less than 32 characters"),
  name: string({ required_error: 'Name is required' })
    .min(2, 'Name is required')
    .max(155, 'Name must be less than 155 characters'),
});
export type RegisterValues = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = object({
  email: string({ required_error: 'Email is required' }).email(
    'Please enter a valid email address',
  )});
export type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = object({
  password: string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirmation: z.string().min(6, {
      message: "Password must be at least 6 characters long."
  }),
  token: z.string().min(6, {
    message: "Token must be at least 6 characters long."
}),
});
export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;