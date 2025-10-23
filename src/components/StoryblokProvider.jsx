'use client';

import { getStoryblokApi } from '@/lib/storyblok';
import { useEffect } from 'react';

export default function StoryblokProvider({ children }) {
	const storyblokApi = getStoryblokApi();
	
	useEffect(() => {
		// Only enable draft mode in preview environments
		const isPreview = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW === 'yes' || process.env.NODE_ENV === 'development';
		
		if (isPreview && typeof window !== 'undefined') {
			// Enable bridge for live preview in Storyblok using dynamic import
			import('@storyblok/react').then(({ loadStoryblokBridge }) => {
				loadStoryblokBridge();
			}).catch(err => {
				console.warn('Failed to load Storyblok bridge:', err);
			});
		}
	}, []);
	
	return children;
}
