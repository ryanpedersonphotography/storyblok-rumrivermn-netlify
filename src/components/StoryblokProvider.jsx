'use client';

import { getStoryblokApi } from '@/lib/storyblok';
import { useEffect } from 'react';

export default function StoryblokProvider({ children }) {
	const storyblokApi = getStoryblokApi();
	
	useEffect(() => {
		// Only enable draft mode in preview environments
		const isPreview = process.env.STORYBLOK_IS_PREVIEW === 'yes' || process.env.NODE_ENV === 'development';
		
		if (isPreview && typeof window !== 'undefined') {
			// Enable bridge for live preview in Storyblok
			const { loadStoryblokBridge } = require('@storyblok/react');
			loadStoryblokBridge();
		}
	}, []);
	
	return children;
}
