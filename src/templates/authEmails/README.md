# Email Templates

This directory contains HTML email templates used by Supabase Auth.

## Available Template Variables

- `{{ .SiteURL }}` - The URL of the site
- `{{ .TokenHash }}` - The hashed token used in the URL
- `{{ .RedirectTo }}` - The URL to redirect to after confirmation
- `{{ .Email }}` - The user's email address
- `{{ .NewEmail }}` - The new email address for email change requests
- `{{ .Token }}` - The 6-digit numeric email OTP

## Templates

1. `signup.html` - Email verification for new sign-ups
2. `password-reset.html` - Password reset requests
3. `magic-link.html` - Magic link authentication
4. `invite.html` - User invitations
5. `email-change.html` - Email address change confirmation
6. `reauthentication.html` - Identity confirmation

## Usage

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Email Templates
3. Select the template you want to update
4. Copy the entire content of the corresponding HTML file
5. Paste into the template editor 