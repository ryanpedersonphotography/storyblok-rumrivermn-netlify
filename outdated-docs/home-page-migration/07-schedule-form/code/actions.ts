'use server'

import { Resend } from 'resend'
import { redirect } from 'next/navigation'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function submitTourRequest(formData: FormData) {
  // Extract form data
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const phone = String(formData.get('phone') || '')
  const proposedEventDate = String(formData.get('proposedEventDate') || '')
  const preferredTourDate = String(formData.get('preferredTourDate') || '')
  const preferredTourTime = String(formData.get('preferredTourTime') || '')
  const guestCount = String(formData.get('guestCount') || '')
  const message = String(formData.get('message') || '')

  // Basic validation
  if (!name || !email || !phone || !preferredTourDate) {
    throw new Error('Required fields missing')
  }

  // Format email content
  const emailContent = `
New Tour Request from Rum River Wedding Barn Website

CONTACT INFORMATION:
Name: ${name}
Email: ${email}
Phone: ${phone}

EVENT DETAILS:
Proposed Event Date: ${proposedEventDate || 'Not specified'}
Preferred Tour Date: ${preferredTourDate}
Preferred Tour Time: ${preferredTourTime || 'Not specified'}
Estimated Guest Count: ${guestCount || 'Not specified'}

ADDITIONAL INFORMATION:
${message || 'No additional information provided'}

---
Submitted via Rum River Wedding Barn contact form
  `.trim()

  try {
    // Send email using Resend
    await resend.emails.send({
      from: 'forms@rumriverbarn.com', // Update with your domain
      to: ['info@rumriverbarn.com'], // Update with your email
      subject: `New Tour Request - ${name}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B4E3D; border-bottom: 2px solid #E4C896; padding-bottom: 10px;">
            New Tour Request
          </h2>
          
          <div style="background: #FFFCF8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #9D6B7B; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          </div>

          <div style="background: #F4E4E1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #9D6B7B; margin-top: 0;">Event Details</h3>
            <p><strong>Proposed Event Date:</strong> ${proposedEventDate || 'Not specified'}</p>
            <p><strong>Preferred Tour Date:</strong> ${preferredTourDate}</p>
            <p><strong>Preferred Tour Time:</strong> ${preferredTourTime || 'Not specified'}</p>
            <p><strong>Estimated Guest Count:</strong> ${guestCount || 'Not specified'}</p>
          </div>

          ${message ? `
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #E4C896;">
              <h3 style="color: #9D6B7B; margin-top: 0;">Additional Information</h3>
              <p style="white-space: pre-line;">${message}</p>
            </div>
          ` : ''}

          <p style="color: #6B4E3D; font-size: 12px; margin-top: 30px; border-top: 1px solid #E4C896; padding-top: 15px;">
            Submitted via Rum River Wedding Barn website contact form
          </p>
        </div>
      `
    })

    // Redirect to thank you page on success
    redirect('/thank-you')
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to submit tour request. Please try again.')
  }
}