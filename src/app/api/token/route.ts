import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs'; // npm install qs

export async function GET(req: NextRequest) {
  const client_id = process.env.BOG_CLIENT_ID;
  const client_secret = process.env.BOG_CLIENT_SECRET;

  // Console log environment variables (without exposing secrets)
  console.log('🔧 Environment Variables Check:');
  console.log('BOG_CLIENT_ID exists:', !!client_id);
  console.log('BOG_CLIENT_SECRET exists:', !!client_secret);
  console.log('Client ID length:', client_id?.length || 0);
  console.log('Client Secret length:', client_secret?.length || 0);

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
  
  // Debug: Log what we're sending (without exposing secrets)
  console.log('🔍 Request Details:');
  console.log('Client ID:', client_id);
  console.log('Client Secret (first 3 chars):', client_secret?.substring(0, 3) + '...');
  console.log('Base64 credentials (first 10 chars):', credentials.substring(0, 10) + '...');
  console.log('Request URL:', 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token');

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

    // Console log the token information
    console.log('✅ BOG Token obtained successfully:');
    console.log('Token Type:', token_type);
    console.log('Expires In:', expires_in, 'seconds');
    console.log('Access Token (first 20 chars):', access_token.substring(0, 20) + '...');
    console.log('Full Access Token:', access_token);

    return NextResponse.json({
      access_token,
      token_type,
      expires_in,
      success: true,
    });
  } catch (error: any) {
    console.error('BOG Token error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });

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
