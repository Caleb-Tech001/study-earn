# Social Authentication Setup Guide

## Overview

StudyEarn now supports Google OAuth and Apple Sign In for seamless authentication. This guide walks you through the complete setup process.

## What's Already Implemented

✅ **Frontend Integration**
- Google OAuth button with proper branding
- Apple Sign In button with proper branding  
- OAuth redirect handling via `/auth/callback`
- Automatic profile creation for social logins
- Role assignment during social signup
- Loading states and error handling

✅ **Backend Infrastructure**
- Auth context with `signInWithProvider` method
- OAuth callback route for handling redirects
- Profile setup flow for new social users
- Session management across all auth methods

## Setup Required in Lovable Cloud

### Step 1: Access Lovable Cloud Backend

1. Click the "View Backend" button below or go to your project settings
2. Navigate to **Authentication** → **Providers**

### Step 2: Configure Google OAuth

#### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to APIs & Services → Library
   - Search for "Google+ API"
   - Click Enable

4. Create OAuth 2.0 Credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     ```
     https://afszuxqcpylimotabbwh.supabase.co
     https://your-preview-url.lovable.app
     https://your-custom-domain.com (if using custom domain)
     ```
   - Add authorized redirect URIs:
     ```
     https://afszuxqcpylimotabbwh.supabase.co/auth/v1/callback
     ```
   - Click Create

5. Copy your:
   - **Client ID**
   - **Client Secret**

#### B. Configure in Lovable Cloud

1. In Lovable Cloud → Authentication → Providers
2. Find **Google** provider
3. Enable it and enter:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
4. Click Save

### Step 3: Configure Apple Sign In

#### A. Create Apple App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to Certificates, IDs & Profiles
3. Select **Identifiers** → Click **+** to create new
4. Choose **App IDs** → Continue
5. Fill in:
   - **Description**: StudyEarn Web App
   - **Bundle ID**: com.studyearn.web (or your own)
6. Enable **Sign In with Apple**
7. Click Continue → Register

#### B. Create Services ID

1. In Identifiers, click **+** again
2. Choose **Services IDs** → Continue
3. Fill in:
   - **Description**: StudyEarn Sign In
   - **Identifier**: com.studyearn.signin (or your own)
4. Enable **Sign In with Apple**
5. Click Configure next to Sign In with Apple:
   - **Primary App ID**: Select your App ID from Step A
   - **Web Domain**: `afszuxqcpylimotabbwh.supabase.co`
   - **Return URLs**: 
     ```
     https://afszuxqcpylimotabbwh.supabase.co/auth/v1/callback
     ```
6. Save → Continue → Register

#### C. Create Private Key

1. Go to **Keys** → Click **+**
2. Enter **Key Name**: StudyEarn Sign In Key
3. Enable **Sign In with Apple**
4. Click Configure → Select your primary App ID
5. Save → Continue → Register
6. **Download the .p8 key file** (can only download once!)
7. Note your **Key ID** (shown at top of key details)
8. Note your **Team ID** (in top right of developer portal)

#### D. Configure in Lovable Cloud

1. In Lovable Cloud → Authentication → Providers
2. Find **Apple** provider
3. Enable it and enter:
   - **Services ID**: Your Services ID (e.g., com.studyearn.signin)
   - **Team ID**: Your Apple Team ID
   - **Key ID**: Your Key ID from the private key
   - **Private Key**: Paste contents of your .p8 file
4. Click Save

## Testing Social Authentication

### Test Google OAuth

1. Go to `/signup` or `/login`
2. Click "Sign up with Google" or "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. You'll be redirected back to StudyEarn
6. Complete profile setup if it's your first time

### Test Apple Sign In

1. Go to `/signup` or `/login`
2. Click "Sign up with Apple" or "Sign in with Apple"
3. Sign in with your Apple ID
4. Choose whether to share your email
5. You'll be redirected back to StudyEarn
6. Complete profile setup if it's your first time

## Important URLs

### Production URLs
- **Site URL**: Your deployed app URL (e.g., `https://yourdomain.com`)
- **Redirect URL**: `https://your-supabase-project.supabase.co/auth/v1/callback`

### Development URLs
- **Preview URL**: `https://your-preview.lovable.app`
- Same redirect URL as production

## Troubleshooting

### Common Issues

#### "redirect_uri_mismatch" (Google)
- **Cause**: Redirect URI not added to Google Console
- **Fix**: Add exact redirect URI from error message to Google Console

#### "invalid_client" (Google)
- **Cause**: Wrong Client ID or Secret
- **Fix**: Re-check credentials in Google Console and Lovable Cloud

#### "invalid_request" (Apple)
- **Cause**: Services ID or domain configuration issue
- **Fix**: Verify Services ID configuration in Apple Developer Portal

#### "User cancelled login"
- **Cause**: User closed OAuth popup or denied permissions
- **Fix**: Normal behavior, user can try again

#### Infinite redirect loop
- **Cause**: Callback route not properly handling session
- **Fix**: Check `/auth/callback` route implementation

### Debug Steps

1. **Check Console Logs**: Look for auth errors in browser console
2. **Check Network Tab**: Inspect OAuth redirect chain
3. **Verify Providers**: Ensure providers are enabled in Lovable Cloud
4. **Test Redirect URLs**: Confirm they match exactly in all configs
5. **Check Auth Logs**: View logs in Lovable Cloud → Authentication → Logs

## Security Considerations

### Production Checklist

✅ Only add authorized domains to OAuth configs
✅ Never expose Client Secrets in frontend code
✅ Use HTTPS for all redirect URLs
✅ Regularly rotate API credentials
✅ Monitor authentication logs for suspicious activity
✅ Set appropriate OAuth scopes (minimal required)

### OAuth Scopes

**Google:**
- `email` - User's email address
- `profile` - Basic profile info (name, picture)

**Apple:**
- `email` - User's email (can be hidden by user)
- `name` - User's name (first time only)

## User Experience

### First-Time Social Login
1. User clicks Google/Apple button
2. OAuth popup appears
3. User grants permissions
4. Returns to app
5. Creates profile with role selection
6. Completes profile setup
7. Redirected to dashboard

### Returning Social Login
1. User clicks Google/Apple button
2. OAuth popup appears (may auto-close if already authenticated)
3. Returns to app
4. Immediately redirected to dashboard

## Advanced Configuration

### Custom OAuth Parameters

You can pass custom parameters during OAuth:

```typescript
const { error } = await signInWithProvider('google', 'learner');
// Role is passed as query param and stored in user metadata
```

### Multiple OAuth Providers

Users can link multiple providers to one account:
- Sign in with Google first time → Creates account
- Sign in with Apple later → Links to existing account (by email)

### Email Verification

Social auth emails are automatically verified since they're validated by OAuth providers.

## Support & Resources

### Documentation Links
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In](https://developer.apple.com/sign-in-with-apple/)

### Common Questions

**Q: Do I need both Google and Apple?**
A: No, you can enable just one. But having both improves accessibility.

**Q: Can users change their email after social signup?**
A: Yes, through account settings (feature can be added).

**Q: What if user's email changes with the OAuth provider?**
A: The account is linked by user ID, not email. Email updates sync automatically.

**Q: Can I add more OAuth providers?**
A: Yes! Supabase supports GitHub, GitLab, Discord, Facebook, Twitter and more.

---

**Next Steps:**
1. Set up Google OAuth (recommended - most widely used)
2. Set up Apple Sign In (recommended for iOS users)
3. Test both flows thoroughly
4. Monitor authentication metrics
5. Consider adding more providers based on user feedback