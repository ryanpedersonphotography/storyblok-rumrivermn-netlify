# Server Actions + Resend Setup Instructions

## 1. Install Dependencies

```bash
pnpm add resend
```

## 2. Environment Variables Setup

### Link to Vercel (if not already linked)
```bash
vercel link
```

### Add Resend API Key to Vercel
```bash
vercel env add RESEND_API_KEY development
vercel env add RESEND_API_KEY production
```

### Pull environment variables locally
```bash
vercel env pull .env.local
```

Alternatively, use `vercel dev` for development.

## 3. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in your dashboard
3. Add it to your environment variables

## 4. Domain Configuration

### Update email addresses in `actions.ts`:
```typescript
// Line 30: Update sender domain
from: 'forms@yourdomain.com', // Replace with your verified domain

// Line 31: Update recipient email  
to: ['info@yourdomain.com'], // Replace with your email
```

### Verify your domain in Resend:
1. Go to Resend dashboard
2. Add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records
4. Wait for verification

## 5. File Structure

Place these files in your Next.js app:

```
app/
├── actions.ts                              # Server action
├── (site)/
│   ├── page.tsx                           # Home page with form
│   └── thank-you/
│       └── page.tsx                       # Thank you page
```

## 6. Import and Use

### In your home page component:
```typescript
import { ScheduleFormSection } from './schedule-form-section-server-actions'

export default function HomePage() {
  return (
    <div>
      {/* Other sections */}
      <ScheduleFormSection />
    </div>
  )
}
```

### Create thank-you page at `app/(site)/thank-you/page.tsx`:
```typescript
import ThankYouPage from './thank-you-page'
export default ThankYouPage
```

## 7. Progressive Enhancement

This form works without JavaScript! The Server Action provides:
- ✅ Progressive enhancement (works before JS loads)
- ✅ No API endpoints needed
- ✅ Automatic error handling
- ✅ Built-in validation
- ✅ Clean redirect handling

## 8. Testing

1. Fill out the form
2. Submit
3. Check that:
   - Email is sent to your inbox
   - User is redirected to `/thank-you`
   - Form data is properly formatted

## 9. Error Handling

The action includes:
- Required field validation
- Email format validation
- Graceful error handling with user-friendly messages
- Console logging for debugging

## 10. Customization Options

### Add spam protection (optional):
```bash
pnpm add @cloudflare/turnstile
```

### Add form state handling (optional):
```typescript
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Schedule Tour'}
    </button>
  )
}
```

### Add success/error states (optional):
```typescript
import { useFormState } from 'react-dom'

const [state, formAction] = useFormState(submitTourRequest, null)
```

This setup provides a modern, Vercel-optimized form solution with minimal code and maximum reliability.