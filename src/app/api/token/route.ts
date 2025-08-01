import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const client_id = '10002062'
  const client_secret = '9XIHAVHT0Iby'

  if (!client_id || !client_secret) {
    return NextResponse.json(
      { error: 'BOG credentials not configured' },
      { status: 500 }
    )
  }

  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

  try {
    const response = await axios.post(
      'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    )

    const { access_token, expires_in, token_type } = response.data

    return NextResponse.json({
      access_token,
      expires_in,
      token_type,
      success: true,
    })
  } catch (error: any) {
    console.error('BOG Token error:', error.response?.data || error.message)
    return NextResponse.json(
      {
        error: 'Failed to get BOG access token',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    )
  }
}
