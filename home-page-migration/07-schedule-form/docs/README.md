# Schedule Form Section Migration Guide

## Overview
Tour scheduling form with glassmorphic design, Next.js Server Actions + Resend integration, and comprehensive field validation.

## ⚡ UPDATE: Now Uses Server Actions + Resend
This section has been updated to use modern Next.js Server Actions with Resend instead of Netlify forms, optimized for Vercel deployment.

## Files Included
- `code/schedule-form-section-server-actions.tsx` - Updated React component with Server Actions
- `code/actions.ts` - Server Action for form handling + Resend email
- `code/thank-you-page.tsx` - Success page component
- `code/setup-instructions.md` - Complete setup guide
- `styles/schedule-form-styles.css` - Complete CSS styling (unchanged)

## Key Features
- **Glassmorphic Design**: Transparent form with backdrop blur
- **Server Actions**: Modern Next.js form handling with progressive enhancement
- **Resend Integration**: Professional email delivery service
- **Zero Endpoints**: No API routes needed, works before JS loads
- **Responsive Grid**: Two-column layout on desktop, single column on mobile
- **Animated Background**: Rotating radial gradient decoration
- **Field Validation**: Required fields with focus states

## Form Fields Structure

### Personal Information
- **Name** (required) - Text input with couple placeholder
- **Email** (required) - Email validation
- **Phone** (required) - Telephone format

### Event Details
- **Proposed Event Date** (optional) - Date picker
- **Preferred Tour Date** (required) - Date picker

### Preferences
- **Preferred Tour Time** (optional) - Select dropdown with 6 time slots
- **Estimated Guest Count** (optional) - Select dropdown with 4 ranges

### Additional Information
- **Message** (optional) - Textarea for questions/details

## Time Slot Options
```typescript
const timeOptions = [
  "10:00 AM",
  "11:00 AM", 
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM"
];
```

## Guest Count Options
```typescript
const guestCountOptions = [
  { value: "50-100", label: "50-100 Guests" },
  { value: "100-150", label: "100-150 Guests" },
  { value: "150-200", label: "150-200 Guests" },
  { value: "200+", label: "200+ Guests" }
];
```

## CSS Classes
- `.hotfix-schedule-tour` - Main section container
- `.hotfix-form-container` - Form wrapper (max 800px)
- `.hotfix-form-header` - Header section
- `.hotfix-form-script` - Script accent text
- `.hotfix-form-title` - Main section title
- `.hotfix-form-description` - Description text
- `.hotfix-tour-form` - Glassmorphic form container
- `.hotfix-form-row` - Two-column grid row
- `.hotfix-form-group` - Individual field group
- `.hotfix-form-label` - Field labels
- `.hotfix-form-input` - Text/email/tel/date inputs
- `.hotfix-form-select` - Select dropdowns
- `.hotfix-form-textarea` - Message textarea
- `.hotfix-form-submit` - Submit button

## Visual Design

### Background System
1. **Gradient**: Deep brown (#4A3426) to walnut brown (#6B4E3D)
2. **Animated Decoration**: Rotating radial gradient (30s duration)
3. **Glassmorphism**: Form with 95% white opacity + backdrop blur

### Form Styling
- **Container**: Max 800px width, centered
- **Glass Effect**: backdrop-filter blur(10px) with transparency
- **Border Radius**: 20px for modern appearance
- **Shadow**: Deep shadow (0 20px 60px) for elevation

### Field Design
- **Borders**: 2px solid with accent gold color
- **Focus States**: Gold border + glow effect
- **Padding**: Generous 15px 20px for touch-friendly design
- **Typography**: Montserrat font family throughout

## Server Actions Integration
```typescript
// actions.ts
'use server'
import { Resend } from 'resend'

export async function submitTourRequest(formData: FormData) {
  const resend = new Resend(process.env.RESEND_API_KEY!)
  // Extract and validate form data
  // Send formatted email via Resend
  // Redirect to thank-you page
}

// Component usage
<form action={submitTourRequest}>
  <!-- form fields -->
</form>
```

## Dependencies Required
```bash
pnpm add resend
```

## Environment Variables
```bash
RESEND_API_KEY=your_resend_api_key
```

## Interactive Effects
1. **Submit Button**: 
   - Hover lift (-2px transform)
   - Color change (dusty rose to walnut brown)
   - Shimmer animation on hover
2. **Input Focus**:
   - Border color change to accent gold
   - Box shadow glow effect
   - Slight background opacity change
3. **Background Animation**:
   - 30-second infinite rotation
   - Subtle radial gradient overlay

## Colors Used
- **Background**: Linear gradient #4A3426 to #6B4E3D
- **Form**: rgba(255, 255, 255, 0.95) with backdrop blur
- **Text**: White headers, dark text (#6B4E3D) in form
- **Accents**: Accent gold (#D4A574), dusty rose (#9D6B7B)
- **Borders**: rgba(212, 165, 116, 0.3) default, #D4A574 focus

## Typography
- **Script**: Dancing Script (1.75rem)
- **Title**: Playfair Display (3rem, 400 weight)
- **Labels**: Montserrat (0.875rem, 500 weight, uppercase)
- **Inputs**: Montserrat (1rem)

## Responsive Behavior
- **Desktop**: Two-column grid for form rows
- **Tablet**: Single column, reduced padding
- **Mobile**: Smaller font sizes, tighter spacing
- **Form Always**: Maintains glassmorphic effect across all sizes

## Migration Notes
1. **Modern Approach**: Uses Next.js Server Actions (recommended by Vercel)
2. **Progressive Enhancement**: Works without JavaScript
3. **Zero API Routes**: No endpoints needed, cleaner architecture
4. **Email Service**: Requires Resend account and API key
5. **Domain Setup**: Requires domain verification in Resend
6. **Thank You Page**: Automatic redirect to `/thank-you` on success
7. **Required Fields**: Name, email, phone, preferred tour date
8. **Validation**: Built-in HTML5 validation + server-side validation
9. **Accessibility**: Proper labels and form associations maintained

## Payload CMS Integration
Convert to contact form block with:
- **Form Configuration**:
  - Form name/identifier
  - Success redirect URL
  - Email notifications setup
- **Field Management**:
  - Dynamic field configuration
  - Required/optional toggles
  - Field types and validation
- **Time Slots**: Admin-configurable available times
- **Guest Ranges**: Admin-configurable capacity options
- **Styling Options**:
  - Background gradient controls
  - Form transparency settings
  - Animation enable/disable

## Form Submission Data
When submitted, form sends:
```json
{
  "form-name": "schedule-tour",
  "name": "John & Sarah",
  "email": "john@example.com", 
  "phone": "(555) 123-4567",
  "proposedEventDate": "2024-06-15",
  "preferredTourDate": "2024-05-20",
  "preferredTourTime": "2:00 PM",
  "guestCount": "100-150",
  "message": "Looking forward to seeing the venue..."
}
```