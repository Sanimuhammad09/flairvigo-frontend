import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginInput } from '@/features/auth/api/schemas';
import { useLogin } from '@/features/auth/api/hooks';

export const Route = createFileRoute('/_auth/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-10">
        <h1 className="heading-display text-3xl sm:text-4xl text-charcoal mb-3">
          Welcome Back
        </h1>
        <p className="text-neutral-500 text-sm">
          Sign in to your account to continue shopping.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-neutral-500 hover:text-charcoal transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-charcoal"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-4 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : null}
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-8">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="text-charcoal font-semibold hover:text-gold transition-colors"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
