# Email Verification Setup Guide

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (for nodemailer)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
NEXTAUTH_URL="http://localhost:3000"
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASSWORD`

## Alternative Email Providers

You can modify the email service in `src/lib/email.ts`:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## How It Works

1. **User Registration**: When a user signs up, a verification token is generated and stored in the database
2. **Email Sending**: A verification email is sent to the user's email address with a link containing the token
3. **Email Verification**: When the user clicks the link, the token is validated and the user's email is marked as verified
4. **Login**: Users can only sign in after their email is verified

## Features

- ✅ Email verification on signup
- ✅ Resend verification email functionality
- ✅ Token expiration (1 hour)
- ✅ Beautiful email templates
- ✅ Error handling
- ✅ User-friendly verification page

## Testing

1. Start your development server: `npm run dev`
2. Sign up with a new account
3. Check your email for the verification link
4. Click the link to verify your email
5. Try signing in with the verified account

## Troubleshooting

### Email not sending
- Check your email credentials
- Ensure 2FA is enabled and app password is correct
- Check your email provider's SMTP settings

### Token not working
- Tokens expire after 1 hour
- Use the resend verification feature if needed
- Check the database for token existence

### Database issues
- Run `npx prisma generate` to update Prisma client
- Run `npx prisma db push` to sync database schema 