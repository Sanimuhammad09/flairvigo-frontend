import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterInput } from '@/features/auth/api/schemas';
import { useRegister } from '@/features/auth/api/hooks';

export const Route = createFileRoute('/_auth/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    const { confirmPassword, ...payload } = data;
    registerMutation.mutate(payload);
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
          Create Account
        </h1>
        <p className="text-neutral-500 text-sm">
          Join the Flairvigo community and discover premium fashion.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="Jane"
              {...register('firstName')}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500">{errors.firstName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500">{errors.lastName.message}</span>
            )}
          </div>
        </div>

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
          <label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              {...register('password')}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-charcoal"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-4 w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : null}
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-8">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-charcoal font-semibold hover:text-gold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
