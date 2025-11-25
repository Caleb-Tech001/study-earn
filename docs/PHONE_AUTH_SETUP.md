# Phone Authentication Setup Guide

## Overview

StudyEarn now supports phone number authentication following global best practices, similar to platforms like Facebook and TikTok.

## Features Implemented

### ✅ Core Features
- **Multi-Method Sign Up**: Email, Phone, or Social (Google/Apple - coming soon)
- **OTP Verification**: 6-digit codes valid for 10 minutes
- **Device Trust System**: Skip OTP for trusted devices (30-day expiry)
- **Account Recovery**: Add secondary email/phone for backup
- **Login History**: Track all authentication attempts
- **Security Monitoring**: Failed attempt tracking and rate limiting

### ✅ Security Features
- Maximum 5 OTP attempts before requiring new code
- Automatic cleanup of expired verification codes
- Device fingerprinting for trusted device identification
- RLS policies protecting all sensitive data
- Separate user_roles table (prevents privilege escalation)

### ✅ User Experience
- Smart device detection (mobile/tablet/desktop)
- Countdown timer for OTP resend
- Auto-focus and paste support for OTP input
- Country code selector for international support
- Seamless fallback between email and phone auth

## SMS Provider Integration

### Required: Twilio Setup

The system is pre-configured for Twilio but you need to add credentials:

1. **Sign up for Twilio**: https://www.twilio.com/try-twilio
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Twilio Phone Number

3. **Add Secrets** (when ready for production):
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Uncomment SMS code** in `supabase/functions/send-otp/index.ts`:
   - Lines 48-62 contain the Twilio integration code
   - Remove the comments when you have credentials

### Development Mode

Currently, OTP codes are:
- Logged to console (visible in edge function logs)
- Returned in API response (dev_otp field)
- Displayed in UI during development

**Remove `dev_otp` exposure before production!**

### Alternative SMS Providers

If you prefer other providers:

- **AWS SNS**: Lower cost for high volume
- **Vonage (Nexmo)**: Good international coverage
- **MessageBird**: EU-focused alternative
- **Africa's Talking**: Best for African markets

Update the `send-otp` edge function accordingly.

## Cost Optimization

### Device Trust System
- Users trust a device = no SMS for 30 days
- Reduces SMS costs by ~70% for regular users
- Automatic expiry prevents security risks

### Best Practices
1. Encourage device trust on personal devices
2. Set appropriate OTP expiry (current: 10 minutes)
3. Monitor failed attempts to prevent abuse
4. Consider implementing CAPTCHA for high-volume accounts

## Regional Considerations

### Africa (Low Email Adoption)
- Phone-first authentication is primary
- Support local SMS providers (Africa's Talking)
- Consider lower SMS costs via local providers

### Global Markets
- Provide both email and phone options
- Allow users to switch preferred method
- Support international country codes

## Database Schema

### New Tables
1. **phone_verification_codes**: Stores OTP codes
2. **trusted_devices**: Manages device trust
3. **account_recovery**: Secondary auth methods
4. **login_history**: Security audit trail

### Updated Tables
- **profiles**: Added phone_number, phone_verified fields
- **user_roles**: Separate table for security

## Testing

### Test Phone Numbers (Development)
Use these formats without triggering real SMS:
- Any number during development (OTP shown in logs)
- Check edge function logs for OTP codes

### Test Flows
1. **Sign Up with Phone**: `/phone-signup` → OTP verification → Profile setup
2. **Login with Phone**: `/phone-login` → Check trusted device → OTP if needed
3. **Device Trust**: Check "Trust this device" during verification
4. **Account Recovery**: Add secondary method in security settings

## Security Checklist

✅ RLS enabled on all tables
✅ Roles stored separately from profiles
✅ OTP attempt limiting (max 5)
✅ Automatic code expiration (10 minutes)
✅ Device trust expiry (30 days)
✅ Login history tracking
✅ Input validation on phone numbers

## Next Steps

### Phase 1: Production SMS (PRIORITY)
1. Sign up for Twilio
2. Add secrets to Lovable Cloud
3. Uncomment SMS code in edge function
4. Remove dev_otp from responses
5. Test with real phone numbers

### Phase 2: Social Authentication
1. Set up Google OAuth
2. Set up Apple Sign In
3. Update auth flows to support social
4. Test cross-platform authentication

### Phase 3: Advanced Features
1. Two-Factor Authentication (2FA)
2. Biometric authentication
3. WebAuthn support
4. Account activity alerts via email

## API Endpoints

### Edge Functions
- **send-otp**: Generate and send verification code
- **verify-otp**: Validate code and create session
- **check-trusted-device**: Check if device is trusted

### Example Calls

```typescript
// Send OTP
const { data } = await supabase.functions.invoke('send-otp', {
  body: { phone_number: '+1234567890', user_id: 'uuid' }
});

// Verify OTP
const { data } = await supabase.functions.invoke('verify-otp', {
  body: { 
    phone_number: '+1234567890',
    code: '123456',
    trust_device: true,
    device_fingerprint: 'abc123'
  }
});

// Check device
const { data } = await supabase.functions.invoke('check-trusted-device', {
  body: {
    user_id: 'uuid',
    device_fingerprint: 'abc123'
  }
});
```

## Monitoring

### Key Metrics to Track
1. **SMS Delivery Rate**: % of OTPs delivered successfully
2. **Verification Success Rate**: % of users who complete OTP
3. **Device Trust Adoption**: % of users trusting devices
4. **Failed Attempt Rate**: Detect potential attacks
5. **Cost per User**: SMS costs per signup/login

### Edge Function Logs
Check Lovable Cloud → Functions → Logs for:
- OTP generation events
- Verification attempts
- Failed authentications
- SMS sending errors

## Support

For issues or questions:
1. Check edge function logs in Lovable Cloud
2. Review database tables for data integrity
3. Test with development OTP codes first
4. Verify RLS policies are working correctly

---

**Remember**: Phone authentication improves accessibility but requires proper SMS provider setup for production use.