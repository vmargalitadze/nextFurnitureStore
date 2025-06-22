// Quick fix to verify the current user
// Run with: node fix-verification.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function fixVerification() {
  try {
    console.log('🔧 Quick fix: Verifying current user...\n');

    const email = 'vaqsii23@gmail.com';

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🔍 Current status: ${user.emailVerified ? '✅ Verified' : '❌ Not verified'}`);

    if (!user.emailVerified) {
      // Verify the user
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });

      console.log('✅ User verified successfully!');
    } else {
      console.log('✅ User already verified');
    }

    // Clean up any verification tokens
    const tokens = await prisma.verificationToken.findMany({
      where: { email }
    });

    if (tokens.length > 0) {
      await prisma.verificationToken.deleteMany({
        where: { email }
      });
      console.log(`🗑️ Cleaned up ${tokens.length} verification token(s)`);
    }

    console.log('🎉 You can now sign in with your account!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVerification(); 