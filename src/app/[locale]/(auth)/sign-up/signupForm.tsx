'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialState = {
  success: false,
  message: '',
};

function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [data, action] = useFormState(signUpUser, initialState);
  const [redirecting, setRedirecting] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();


  useEffect(() => {
    if (data.success) {
      setRedirecting(true);
      router.push('/'); 
    }
  }, [data.success, callbackUrl, router]);

  const SignUpButton = () => (
    <Button disabled={pending || redirecting} className="w-full" variant="default">
      {redirecting ? 'Redirecting...' : pending ? 'Submitting...' : 'Sign Up'}
    </Button>
  );

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" autoComplete="name" defaultValue={signUpDefaultValues.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" defaultValue={signUpDefaultValues.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="password" defaultValue={signUpDefaultValues.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="confirmPassword" defaultValue={signUpDefaultValues.confirmPassword} />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
