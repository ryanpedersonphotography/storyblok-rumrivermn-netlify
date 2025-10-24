'use client'

import React from 'react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'

interface PageProps {
  blok: any
}

export default function Page({ blok }: PageProps) {
  return (
    <div {...storyblokEditable(blok)}>
      {(blok.body || []).map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}
