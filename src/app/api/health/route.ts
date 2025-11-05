// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    checks: {
      storyblok: !!process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
      netlify: !!process.env.NETLIFY,
      buildHook: !!process.env.NETLIFY_BUILD_HOOK,
      webhookSecret: !!process.env.STORYBLOK_WEBHOOK_SECRET,
    }
  }
  
  return NextResponse.json(health)
}