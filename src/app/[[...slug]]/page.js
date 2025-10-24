import { fetchStory } from '@/lib/storyblok';
import StoryblokBridge from '@/components/storyblok/client/StoryblokBridge';

// Enable Visual Editor support with draft mode
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default async function Page({ params }) {
	const { slug } = await params;
	const fullSlug = slug ? slug.join('/') : 'home';

	// Always fetch draft version for Visual Editor support
	const story = await fetchStory(fullSlug, 'draft');

	if (!story) {
		return (
			<div className="error-container" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
				<h1>Story not found</h1>
				<p>The story &ldquo;{fullSlug}&rdquo; could not be loaded.</p>
			</div>
		);
	}

	return <StoryblokBridge initialStory={story} />;
}
