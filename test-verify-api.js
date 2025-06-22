// Test the verification API endpoint
// Run with: node test-verify-api.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testVerifyAPI() {
  try {
    console.log('🧪 Testing Verification API...\n');

    // Get the latest verification token
    const token = await prisma.verificationToken.findFirst({
      where: { email: 'vaqsii23@gmail.com' },
      orderBy: { expires: 'desc' }
    });

    if (!token) {
      console.log('❌ No verification token found');
      return;
    }

    console.log(`📧 Testing with token: ${token.token.substring(0, 8)}...`);
    console.log(`📧 Email: ${token.email}`);
    console.log(`⏰ Expires: ${token.expires.toLocaleString()}`);

    // Test the verification process manually
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🔍 Current verification status: ${user.emailVerified ? '✅ Verified' : '❌ Not verified'}`);

    // Simulate the verification API
    if (new Date() > token.expires) {
      console.log('❌ Token has expired');
      return;
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { id: token.id }
    });

    console.log('✅ Email verified successfully!');
    console.log('🎉 You can now sign in with your account.');

    // Verify the update
    const updatedUser = await prisma.user.findUnique({
      where: { email: token.email }
    });

    console.log(`🔍 New verification status: ${updatedUser.emailVerified ? `✅ Verified - ${updatedUser.emailVerified.toLocaleString()}` : '❌ Not verified'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testVerifyAPI(); 