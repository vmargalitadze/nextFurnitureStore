import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 API: Starting email verification...');
    const { token } = await req.json();
    console.log('🔍 API: Token received:', token ? token.substring(0, 8) + '...' : 'null');

    if (!token) {
      console.log('❌ API: No token provided');
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    console.log('🔍 API: Looking for verification token...');
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      console.log('❌ API: Invalid verification token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    console.log('✅ API: Token found for email:', verificationToken.email);
    console.log('⏰ API: Token expires:', verificationToken.expires.toLocaleString());

    if (new Date() > verificationToken.expires) {
      console.log('❌ API: Token expired');
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    console.log('🔍 API: Looking for user...');
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      console.log('❌ API: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ API: User found:', user.name);
    console.log('🔍 API: Current emailVerified status:', user.emailVerified);

    console.log('🔄 API: Updating user verification status...');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    console.log('✅ API: User updated successfully');
    console.log('🔍 API: New emailVerified status:', updatedUser.emailVerified);

    console.log('🗑️ API: Deleting verification token...');
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    console.log('✅ API: Email verification completed successfully');
    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ API: Error verifying email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
