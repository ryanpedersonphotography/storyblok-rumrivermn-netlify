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
		const storyblokApi = getStoryblokApi();
		let { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams);
		return <StoryblokStory story={data.story} />;
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
					<p><strong>Version:</strong> {sbParams.version}</p>
					<p><strong>Error Status:</strong> {error.response?.status || 'Unknown'}</p>
					<p><strong>Region:</strong> {process.env.STORYBLOK_REGION}</p>
				</div>
				
				<p style={{ marginTop: '1rem' }}>
					<Link href="/test" style={{ color: '#007bff' }}>Visit test page</Link> to verify deployment is working.
				</p>
			</div>
		);
	}
}
