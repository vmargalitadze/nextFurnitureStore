"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Link } from '@/i18n/navigation'
import React, { useEffect, useState } from 'react'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { useActionState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { useRouter, useSearchParams } from 'next/navigation';
export const signInDefaultValues = {
  email: 'admin@example.com',
  password: '123456',
};

const initialState = {
  success: false,
  message: '',
};

function CredentialsForm({ callbackUrl }: { callbackUrl: string }) {
  const [redirecting, setRedirecting] = useState(false);
  const [data, action] = useFormState(signInWithCredentials, initialState);
  const searchParams = useSearchParams();
  const router = useRouter();
    useEffect(() => {
      if (data.success) {
        setRedirecting(true);
        router.push('/'); 
      }
    }, [data.success, callbackUrl, router]);
 

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <form action={action}>
    <input type='hidden' name='callbackUrl' value={callbackUrl} />
    <div className='space-y-6'>
      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          required
          autoComplete='email'
          defaultValue={signInDefaultValues.email}
        />
      </div>
      <div>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          required
          autoComplete='password'
          defaultValue={signInDefaultValues.password}
        />
      </div>
      <div>
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className='text-center text-destructive'>{data.message}</div>
      )}

      <div className='text-sm text-center text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link href='/sign-up' target='_self' className='link'>
          Sign Up
        </Link>
      </div>
    </div>
  </form>
  )
}

export default CredentialsForm