import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import Link from 'next/link';

export default async function Page({ params }) {
	const { slug } = await params;

	let fullSlug = slug ? slug.join('/') : 'home';

	let sbParams = {
		version: process.env.STORYBLOK_IS_PREVIEW === 'yes' ? 'draft' : 'published',
	};

	try {
		// Direct API call to bypass potential caching issues
		const token = process.env.STORYBLOK_ACCESS_TOKEN;
		const version = process.env.STORYBLOK_IS_PREVIEW === 'yes' ? 'draft' : 'published';
		
		const response = await fetch(
			`https://api.storyblok.com/v2/cdn/stories/${fullSlug}?token=${token}&version=${version}&cv=${Date.now()}`,
			{ cache: 'no-store' }
		);
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${await response.text()}`);
		}
		
		const { story } = await response.json();
		return <StoryblokStory story={story} />;
	} catch (error) {
		console.error('Storyblok API Error:', error);
		
		return (
			<div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
				<h1>Content Loading Error</h1>
				<p>There was an issue loading content from Storyblok.</p>
				
				{error.response?.status === 401 && (
					<div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
						<h3>Authentication Issue</h3>
						<p>The Storyblok access token appears to be invalid or expired.</p>
						<p>Please check your STORYBLOK_ACCESS_TOKEN environment variable.</p>
					</div>
				)}
				
				{error.response?.status === 404 && (
					<div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
						<h3>Content Not Found</h3>
						<p>The requested story &ldquo;{fullSlug}&rdquo; was not found in Storyblok.</p>
						<p>Please check if the story exists and is published.</p>
					</div>
				)}
				
				<div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
					<h3>Debug Information</h3>
					<p><strong>Requested Slug:</strong> {fullSlug}</p>
					<p><strong>Version:</strong> {version}</p>
					<p><strong>Error Status:</strong> {error.message || 'Unknown'}</p>
					<p><strong>Region:</strong> {process.env.STORYBLOK_REGION}</p>
					<p><strong>Token:</strong> {process.env.STORYBLOK_ACCESS_TOKEN}</p>
					<p><strong>Preview Mode:</strong> {process.env.STORYBLOK_IS_PREVIEW}</p>
				</div>
				
				<p style={{ marginTop: '1rem' }}>
					<Link href="/test" style={{ color: '#007bff' }}>Visit test page</Link> to verify deployment is working. | 
					<Link href="/debug" style={{ color: '#007bff' }}> Debug Console</Link> for detailed diagnostics.
				</p>
			</div>
		);
	}
}
