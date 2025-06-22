// Debug script to check verification status
// Run with: node debug-verification.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugVerification() {
  try {
    console.log('🔍 Debugging Email Verification...\n');

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

    // Check verification tokens
    const tokens = await prisma.verificationToken.findMany({
      select: {
        id: true,
        email: true,
        token: true,
        expires: true,
      }
    });

    console.log('🔑 Verification Tokens:');
    if (tokens.length === 0) {
      console.log('No verification tokens found');
    } else {
      tokens.forEach((token, index) => {
        const isExpired = new Date() > token.expires;
        console.log(`${index + 1}. ${token.email}`);
        console.log(`   Token: ${token.token.substring(0, 8)}...`);
        console.log(`   Expires: ${token.expires.toLocaleString()}`);
        console.log(`   Status: ${isExpired ? '❌ Expired' : '✅ Valid'}`);
        console.log('');
      });
    }

    // Test verification URL
    if (tokens.length > 0) {
      const latestToken = tokens[0];
      const verificationUrl = `http://localhost:3000/verify-email?token=${latestToken.token}`;
      console.log('🔗 Test Verification URL:');
      console.log(verificationUrl);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugVerification(); 