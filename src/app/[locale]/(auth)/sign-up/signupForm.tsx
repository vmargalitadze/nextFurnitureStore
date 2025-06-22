'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from "@/i18n/navigation";
import { useFormState, useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';

const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialState = {
  success: false,
  message: '',
  email: '',
};

function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [data, action] = useFormState(signUpUser, initialState);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();

  useEffect(() => {
    if (data.success && data.email) {
      setShowVerificationMessage(true);
    }
  }, [data.success, data.email]);

  const SignUpButton = () => (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? 'Creating Account...' : 'Sign Up'}
    </Button>
  );

  const handleResendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Show success message
        alert('Verification email sent successfully! Please check your inbox.');
      } else {
        alert(result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      alert('Failed to resend verification email');
    }
  };

  if (showVerificationMessage) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We have sent a verification link to <strong>{data.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your account setup.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleResendVerification}
                variant="outline"
                className="w-full"
              >
                Resend Verification Email
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
