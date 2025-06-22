// Debug script to check verification token issues
// Run with: node debug-token.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugToken() {
  try {
    console.log('🔍 Debugging Verification Token Issues...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 Current Users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Email Verified: ${user.emailVerified ? `✅ Yes - ${user.emailVerified.toLocaleString()}` : '❌ No (null)'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    // Get all verification tokens
    const tokens = await prisma.verificationToken.findMany({
      select: {
        id: true,
        email: true,
        token: true,
        expires: true,
      },
      orderBy: {
        expires: 'desc'
      }
    });

    console.log('🔑 All Verification Tokens:');
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

    // Test getVerificationTokenByEmail function
    if (users.length > 0) {
      const testEmail = users[0].email;
      console.log(`🧪 Testing getVerificationTokenByEmail for: ${testEmail}`);
      
      const token = await prisma.verificationToken.findFirst({
        where: { email: testEmail },
        orderBy: { expires: 'desc' }
      });

      if (token) {
        console.log(`✅ Found token: ${token.token.substring(0, 8)}...`);
        console.log(`   Expires: ${token.expires.toLocaleString()}`);
        
        // Test verification process
        const user = await prisma.user.findUnique({
          where: { email: testEmail }
        });

        if (user && !user.emailVerified) {
          console.log('🔄 Testing verification process...');
          
          // Update user to mark email as verified
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          });

          // Delete the verification token
          await prisma.verificationToken.delete({
            where: { id: token.id }
          });

          console.log('✅ Verification completed successfully!');
        } else if (user && user.emailVerified) {
          console.log('✅ User already verified');
        }
      } else {
        console.log('❌ No token found for this email');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugToken(); 