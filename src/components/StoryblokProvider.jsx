'use client';

import { storyblokInit } from '@storyblok/react';
import { getStoryblokApi } from '@/lib/storyblok';
import Page from '@/components/storyblok/Page';
import HeroEditor from '@/components/storyblok/HeroEditor';
import AlternatingBlocksEditor from '@/components/storyblok/AlternatingBlocksEditor';
import LoveStoriesGalleryEditor from '@/components/storyblok/LoveStoriesGalleryEditor';
import BrandSocialProofEditor from '@/components/storyblok/BrandSocialProofEditor';
import TestimonialsEditor, { TestimonialItem } from '@/components/storyblok/TestimonialsEditor';
import HistoryCarouselEditor from '@/components/storyblok/HistoryCarouselEditor';
import ScheduleFormEditor from '@/components/storyblok/ScheduleFormEditor';
import MapSectionEditor, { LocationItem } from '@/components/storyblok/MapSectionEditor';
import FooterEditor from '@/components/storyblok/FooterEditor';

// Initialize Storyblok CLIENT-SIDE components globally
storyblokInit({
	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN || '',
	components: {
		page: Page,
		home_hero_section: HeroEditor,
		alternating_blocks_section: AlternatingBlocksEditor,
		love_stories_gallery: LoveStoriesGalleryEditor,
		brand_social_proof: BrandSocialProofEditor,
		testimonials_section: TestimonialsEditor,
		testimonial_item: TestimonialItem,
		history_carousel: HistoryCarouselEditor,
		history_slide: HistoryCarouselEditor,
		schedule_form: ScheduleFormEditor,
		map_section: MapSectionEditor,
		location_item: LocationItem,
		footer_section: FooterEditor,
	},
});

export default function StoryblokProvider({ children }) {
	// Initialize the API (required for component registration)
	getStoryblokApi();

	// Note: Bridge is now loaded on /home-live route only (see ClientBridge.tsx)
	// Global bridge loading has been removed to prevent conflicts

	return children;
}
