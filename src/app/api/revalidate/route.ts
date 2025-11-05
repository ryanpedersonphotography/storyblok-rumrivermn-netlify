/**
 * Storyblok webhook endpoint for triggering rebuilds
 * Netlify version - triggers build hooks instead of ISR
 * Configure this URL in Storyblok webhook settings
 */

import { NextRequest, NextResponse } from 'next/server'

// Verify webhook secret (set in Storyblok and env)
const WEBHOOK_SECRET = process.env.STORYBLOK_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    if (WEBHOOK_SECRET) {
      const signature = request.headers.get('webhook-signature')
      if (signature !== WEBHOOK_SECRET) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        )
      }
    }

    const body = await request.json()
    
    // Storyblok webhook payload structure
    const { story_id, action, slug, full_slug } = body

    console.log('Webhook received:', { story_id, action, slug, full_slug })

    // Trigger Netlify build hook for rebuilds
    const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK_URL
    
    if (NETLIFY_BUILD_HOOK) {
      // Trigger rebuild with context
      const buildResponse = await fetch(NETLIFY_BUILD_HOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger_title: `Storyblok: ${action} - ${full_slug || 'content'}`,
          clear_cache: true,
        }),
      })

      if (!buildResponse.ok) {
        throw new Error('Failed to trigger Netlify build')
      }

      console.log('Netlify build triggered successfully')
    } else {
      console.warn('NETLIFY_BUILD_HOOK_URL not configured')
    }

    return NextResponse.json({
      revalidated: true,
      story_id,
      full_slug,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}

// Also support manual rebuild trigger via GET (protected)
export async function GET(request: NextRequest) {
  // Check for secret token to prevent unauthorized rebuilds
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  try {
    const NETLIFY_BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK_URL
    
    if (!NETLIFY_BUILD_HOOK) {
      return NextResponse.json(
        { error: 'Build hook not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(NETLIFY_BUILD_HOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger_title: 'Manual rebuild via API',
        clear_cache: true,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to trigger build')
    }

    return NextResponse.json({ 
      rebuilt: true, 
      timestamp: Date.now() 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Rebuild failed' },
      { status: 500 }
    )
  }
}