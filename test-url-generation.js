// Test script to verify URL generation
// Run with: node test-url-generation.js

require('dotenv').config({ path: '.env.local' });

function testUrlGeneration() {
  console.log('🔗 Testing URL Generation...\n');

  const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
  const testToken = 'test-token-123';

  console.log('Environment Variables:');
  console.log('NEXTAUTH_URL:', NEXTAUTH_URL || '❌ Not set');
  console.log('');

  if (!NEXTAUTH_URL) {
    console.log('❌ NEXTAUTH_URL is not set in .env.local');
    console.log('Please add: NEXTAUTH_URL="http://localhost:3000"');
    return;
  }

  // Test old URL (incorrect)
  const oldUrl = `${NEXTAUTH_URL}/verify-email?token=${testToken}`;
  console.log('❌ Old URL (incorrect):');
  console.log(oldUrl);
  console.log('');

  // Test new URL (correct)
  const newUrl = `${NEXTAUTH_URL}/en/verify-email?token=${testToken}`;
  console.log('✅ New URL (correct):');
  console.log(newUrl);
  console.log('');

  // Test different locales
  const locales = ['en', 'ge'];
  console.log('🌍 Testing different locales:');
  locales.forEach(locale => {
    const url = `${NEXTAUTH_URL}/${locale}/verify-email?token=${testToken}`;
    console.log(`${locale}: ${url}`);
  });
  console.log('');

  console.log('📝 Instructions:');
  console.log('1. The verification page is at /[locale]/verify-email');
  console.log('2. Email links should use /en/verify-email or /ge/verify-email');
  console.log('3. Make sure NEXTAUTH_URL is set correctly in .env.local');
}

testUrlGeneration(); 