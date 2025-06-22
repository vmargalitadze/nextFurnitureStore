// Comprehensive test for email verification flow
// Run with: node test-verification-flow.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testVerificationFlow() {
  try {
    console.log('🧪 Testing Complete Email Verification Flow...\n');

    // Step 1: Check current state
    console.log('📋 Step 1: Checking current database state...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('Current Users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Email Verified: ${user.emailVerified ? `✅ Yes - ${user.emailVerified.toLocaleString()}` : '❌ No (null)'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    const tokens = await prisma.verificationToken.findMany({
      select: {
        id: true,
        email: true,
        token: true,
        expires: true,
      },
      orderBy: { expires: 'desc' }
    });

    console.log('Current Verification Tokens:');
    if (tokens.length === 0) {
      console.log('No verification tokens found');
    } else {
      tokens.forEach((token, index) => {
        const isExpired = new Date() > token.expires;
        console.log(`${index + 1}. ${token.email}`);
        console.log(`   Token: ${token.token}`);
        console.log(`   Expires: ${token.expires.toLocaleString()}`);
        console.log(`   Status: ${isExpired ? '❌ Expired' : '✅ Valid'}`);
        console.log('');
      });
    }

    // Step 2: Test verification process manually
    if (tokens.length > 0) {
      const testToken = tokens[0];
      console.log('🔄 Step 2: Testing verification process manually...');
      console.log(`Testing with token: ${testToken.token.substring(0, 8)}...`);
      console.log(`For email: ${testToken.email}`);

      // Check if token is valid
      if (new Date() > testToken.expires) {
        console.log('❌ Token has expired, cannot test');
        return;
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: testToken.email }
      });

      if (!user) {
        console.log('❌ User not found');
        return;
      }

      console.log(`✅ User found: ${user.name}`);
      console.log(`Current emailVerified: ${user.emailVerified ? user.emailVerified.toLocaleString() : 'null'}`);

      // Simulate the API verification process
      console.log('🔄 Updating user verification status...');
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });

      console.log(`✅ User updated successfully`);
      console.log(`New emailVerified: ${updatedUser.emailVerified.toLocaleString()}`);

      // Delete token
      console.log('🗑️ Deleting verification token...');
      await prisma.verificationToken.delete({
        where: { id: testToken.id }
      });

      console.log('✅ Token deleted successfully');

      // Step 3: Verify the changes
      console.log('\n📋 Step 3: Verifying changes...');
      
      const finalUser = await prisma.user.findUnique({
        where: { email: testToken.email }
      });

      console.log(`Final user status: ${finalUser.emailVerified ? `✅ Verified - ${finalUser.emailVerified.toLocaleString()}` : '❌ Not verified'}`);

      const remainingTokens = await prisma.verificationToken.findMany({
        where: { email: testToken.email }
      });

      console.log(`Remaining tokens for this email: ${remainingTokens.length}`);

      if (finalUser.emailVerified) {
        console.log('\n🎉 SUCCESS: Email verification process works correctly!');
        console.log('The issue might be in the web interface or API call.');
      } else {
        console.log('\n❌ FAILURE: Email verification process failed!');
        console.log('The database update is not working properly.');
      }
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testVerificationFlow(); 