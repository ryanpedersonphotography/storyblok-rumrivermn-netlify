import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')
  
  // Validate the secret token
  if (secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }
  
  // Enable draft mode
  const draft = await draftMode()
  draft.enable()
  
  // Redirect to the specified slug or default to /home-live
  const redirectPath = slug || '/home-live'
  redirect(redirectPath)
}