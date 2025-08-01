// Test utility for BOG payment setup
export async function testBOGSetup() {
  try {
    console.log('🧪 Testing BOG Payment Setup...');
    
    // Test 1: Check environment variables
    const clientId = process.env.BOG_CLIENT_ID;
    const clientSecret = process.env.BOG_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return {
        success: false,
        error: 'Missing BOG credentials in environment variables',
        details: {
          BOG_CLIENT_ID: clientId ? '✅ Set' : '❌ Missing',
          BOG_CLIENT_SECRET: clientSecret ? '✅ Set' : '❌ Missing',
        }
      };
    }
    
    console.log('✅ Environment variables are configured');
    
    // Test 2: Test token endpoint
    try {
      const tokenResponse = await fetch('/api/token');
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.success) {
        return {
          success: false,
          error: 'Failed to get BOG access token',
          details: tokenData
        };
      }
      
      console.log('✅ BOG token endpoint working');
      console.log('✅ Access token received:', tokenData.access_token.substring(0, 20) + '...');
      
      return {
        success: true,
        message: 'BOG setup is working correctly!',
        details: {
          tokenReceived: true,
          tokenType: tokenData.token_type,
          expiresIn: tokenData.expires_in
        }
      };
      
    } catch (tokenError) {
      return {
        success: false,
        error: 'Token endpoint test failed',
        details: tokenError instanceof Error ? tokenError.message : 'Unknown error'
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: 'BOG setup test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Test payment order creation (for development only)
export async function testPaymentOrder(token: string) {
  try {
    // Use exact format as shown in BOG documentation
    const testOrderData = {
      cart: {
        items: [
          {
            productId: 'product123',
            name: 'Test Product',
            price: '1.00',
            qty: 1,
            image: 'https://example.com/test.jpg'
          }
        ]
      },
      address: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+995555123456'
      },
      deliveryOption: 'tbilisi',
      deliveryPrice: 0,
      totalAmount: 1,
      orderId: 'id123'
    };

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token,
        orderData: testOrderData 
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Test payment order created successfully');
      return {
        success: true,
        message: 'Test payment order created',
        orderId: data.orderId,
        redirectUrl: data.redirectUrl
      };
    } else {
      return {
        success: false,
        error: 'Test payment order failed',
        details: data
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: 'Test payment order error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 