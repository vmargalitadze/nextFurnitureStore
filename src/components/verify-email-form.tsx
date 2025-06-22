'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function VerifyEmailForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('🔍 Starting email verification...');
      console.log('Token:', token);
      console.log('Current URL:', window.location.href);
      
      if (!token) {
        console.log('❌ No token provided');
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        console.log('📡 Making API call to /api/auth/verify-email...');
        console.log('📡 Request body:', { token });
        
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('📡 Response data:', data);

        if (response.ok) {
          console.log('✅ Verification successful');
          setStatus('success');
          setMessage(data.message);
        } else {
          console.log('❌ Verification failed:', data.error);
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        console.log('❌ Error during verification:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again or contact support.');
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(verifyEmail, 100);
    return () => clearTimeout(timer);
  }, [token]);

  const handleResendVerification = async () => {
    try {
      const email = searchParams.get('email');
      console.log('📧 Resending verification email to:', email);
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Verification email sent successfully! Please check your inbox.');
      } else {
        alert(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('Failed to resend verification email');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle>
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' ? (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  Continue to Sign In
                </Link>
              </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
} 