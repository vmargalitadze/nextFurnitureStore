'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testBOGSetup, testPaymentOrder } from '@/lib/test-bog-setup';

export default function TestBOGPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testBOGSetup();
      setTestResult(result);
      
      if (result.success) {
        console.log('✅ BOG Setup Test Passed:', result);
      } else {
        console.error('❌ BOG Setup Test Failed:', result);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    if (!testResult?.success) {
      alert('Please run the setup test first');
      return;
    }

    setLoading(true);
    try {
      // Get a fresh token
      const tokenResponse = await fetch('/api/token');
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.success) {
        throw new Error('Failed to get token');
      }

      const result = await testPaymentOrder(tokenData.access_token);
      setTestResult(result);
      
      if (result.success) {
        console.log('✅ Payment Test Passed:', result);
        if (result.redirectUrl) {
          if (confirm('Payment order created successfully! Do you want to redirect to BOG payment page?')) {
            window.open(result.redirectUrl, '_blank');
          }
        }
      } else {
        console.error('❌ Payment Test Failed:', result);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Payment test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testExactBOGAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-bog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      setTestResult(result);
      
      if (result.success) {
        console.log('✅ Exact BOG API Test Passed:', result);
        if (result.data._links?.redirect?.href) {
          if (confirm('Exact BOG API call successful! Do you want to redirect to BOG payment page?')) {
            window.open(result.data._links.redirect.href, '_blank');
          }
        }
      } else {
        console.error('❌ Exact BOG API Test Failed:', result);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Exact BOG API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[80px]">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              BOG Payment Integration Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
                         <div className="text-center space-y-4">
               <Button 
                 onClick={runTest} 
                 disabled={loading}
                 className="w-full"
               >
                 {loading ? 'Testing...' : 'Test BOG Setup'}
               </Button>
               
               <Button 
                 onClick={testExactBOGAPI} 
                 disabled={loading}
                 variant="outline"
                 className="w-full"
               >
                 {loading ? 'Testing...' : 'Test Exact BOG API (Curl Format)'}
               </Button>
               
               {testResult?.success && (
                 <Button 
                   onClick={testPayment} 
                   disabled={loading}
                   variant="outline"
                   className="w-full"
                 >
                   {loading ? 'Testing Payment...' : 'Test Payment Order'}
                 </Button>
               )}
             </div>

            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? '✅ Test Passed' : '❌ Test Failed'}
                </h3>
                
                <p className={`mb-2 ${
                  testResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResult.message || testResult.error}
                </p>
                
                {testResult.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">
                      View Details
                    </summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-semibold">What this test does:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Checks if BOG environment variables are configured</li>
                <li>Tests the token endpoint to get BOG access token</li>
                <li>Tests payment order creation with sample data</li>
                <li>Verifies the complete payment flow</li>
              </ul>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-semibold">Required Environment Variables:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>BOG_CLIENT_ID</code> - Your BOG client ID</li>
                <li><code>BOG_CLIENT_SECRET</code> - Your BOG client secret</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 