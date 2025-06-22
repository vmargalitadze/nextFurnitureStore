import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json({ error: 'Missing token' }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });


    if (!verificationToken || verificationToken.expires < new Date()) {
      return Response.json({ error: 'Token is invalid or expired' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { email: verificationToken.email },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    return Response.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
