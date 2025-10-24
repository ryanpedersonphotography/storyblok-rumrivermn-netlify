'use client';

import { getStoryblokApi } from '@/lib/storyblok';

export default function StoryblokProvider({ children }) {
	// Initialize the API (required for component registration)
	getStoryblokApi();

	// Note: Bridge is now loaded on /home-live route only (see ClientBridge.tsx)
	// Global bridge loading has been removed to prevent conflicts

	return children;
}
