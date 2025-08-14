import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs'; // npm install qs

export async function GET(req: NextRequest) {
  const client_id = process.env.BOG_CLIENT_ID;
  const client_secret = process.env.BOG_CLIENT_SECRET;



  // Validate credentials exist
  if (!client_id || !client_secret) {
    console.error('❌ Missing BOG credentials');
    return NextResponse.json(
      { 
        error: 'Missing BOG credentials',
        details: 'BOG_CLIENT_ID and BOG_CLIENT_SECRET must be set in environment variables'
      },
      { status: 500 }
    );
  }

  // Validate credential format
  if (!/^\d+$/.test(client_id)) {
    console.error('❌ Invalid BOG_CLIENT_ID format - should be numeric');
    return NextResponse.json(
      { 
        error: 'Invalid BOG_CLIENT_ID format',
        details: 'Client ID should be numeric only'
      },
      { status: 500 }
    );
  }

  if (!/^[A-Za-z0-9]+$/.test(client_secret)) {
    console.error('❌ Invalid BOG_CLIENT_SECRET format - should be alphanumeric only');
    return NextResponse.json(
      { 
        error: 'Invalid BOG_CLIENT_SECRET format',
        details: 'Client secret should contain only letters and numbers'
      },
      { status: 500 }
    );
  }

  // base64 encode
  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
 

  try {
    const response = await axios.post(
      'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token',
      qs.stringify({ grant_type: 'client_credentials' }), // Body – correct encoding
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`, // Basic auth header
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const { access_token, token_type, expires_in } = response.data;

 

    return NextResponse.json({
      access_token,
      token_type,
      expires_in,
      success: true,
    });
  } catch (error: any) {
    console.error('BOG Token error:',);

    // Provide more specific error messages
    let errorMessage = 'Failed to get BOG access token';
    let errorDetails = error.response?.data || error.message;

    if (error.response?.status === 401) {
      if (error.response?.data?.error === 'unauthorized_client') {
        errorMessage = 'Invalid BOG credentials';
        errorDetails = 'Please check your BOG_CLIENT_ID and BOG_CLIENT_SECRET. Make sure they are correct and match your BOG application registration.';
      } else {
        errorMessage = 'Authentication failed';
        errorDetails = 'BOG API rejected the authentication request. Please verify your credentials.';
      }
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request format';
      errorDetails = 'The request format is incorrect. Please check the API documentation.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout';
      errorDetails = 'The request to BOG API timed out. Please try again.';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        status: error.response?.status,
      },
      { status: error.response?.status || 500 }
    );
  }
}
