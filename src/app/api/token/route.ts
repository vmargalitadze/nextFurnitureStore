import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs'; // npm install qs

export async function GET(req: NextRequest) {
  const client_id = process.env.BOG_CLIENT_ID || '10002062';
  const client_secret = process.env.BOG_CLIENT_SECRET || '9XIHAVHT0Iby';

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
    console.error('BOG Token error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });

    return NextResponse.json(
      {
        error: 'Failed to get BOG access token',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
