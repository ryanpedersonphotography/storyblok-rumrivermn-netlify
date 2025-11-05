// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify Storyblok webhook signature
function verifyStoryblokSignature(payload: string, signature: string): boolean {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET
  if (!secret) return false
  
  const hash = crypto
    .createHmac('sha1', secret)
    .update(payload)
    .digest('hex')
  
  return `sha1=${hash}` === signature
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('webhook-signature') || ''
    
    // Verify webhook signature
    if (!verifyStoryblokSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Parse the webhook payload
    const payload = JSON.parse(body)
    const { action, story_id, full_slug } = payload
    
    // Log the webhook event
    console.log(`[Storyblok Webhook] Action: ${action}, Story: ${full_slug || story_id}`)
    
    // Trigger Netlify build hook
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK
    if (!buildHookUrl) {
      console.error('[Storyblok Webhook] NETLIFY_BUILD_HOOK not configured')
      return NextResponse.json(
        { error: 'Build hook not configured' },
        { status: 500 }
      )
    }
    
    // Send build trigger to Netlify
    const buildResponse = await fetch(buildHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger_title: `Storyblok ${action}: ${full_slug || story_id}`,
        trigger_branch: process.env.DEPLOY_BRANCH || 'main',
      }),
    })
    
    if (!buildResponse.ok) {
      throw new Error(`Build hook failed: ${buildResponse.status}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Build triggered successfully',
      story: full_slug || story_id,
      action,
    })
    
  } catch (error) {
    console.error('[Storyblok Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    webhook_configured: !!process.env.STORYBLOK_WEBHOOK_SECRET,
    build_hook_configured: !!process.env.NETLIFY_BUILD_HOOK,
  })
}