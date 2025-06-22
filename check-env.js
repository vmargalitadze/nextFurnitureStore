require('dotenv').config();

console.log('🔍 Checking Environment Variables...\n');

console.log('FROM_EMAIL:', process.env.FROM_EMAIL || 'Missing');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Missing');

if (!process.env.RESEND_API_KEY) {
  console.log('\n❌ RESEND_API_KEY is missing!');
  console.log('Please add it to your .env file:');
  console.log('RESEND_API_KEY="re_your_api_key_here"');
} else {
  console.log('\n✅ RESEND_API_KEY is set');
}

if (!process.env.FROM_EMAIL) {
  console.log('\n❌ FROM_EMAIL is missing!');
  console.log('Please add it to your .env file:');
  console.log('FROM_EMAIL="Furniture Store <vaqsii23@gmail.com>"');
} else {
  console.log('\n✅ FROM_EMAIL is set');
} 