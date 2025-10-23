export default function TestPage() {
	return (
		<div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
			<h1>Deployment Test Page</h1>
			<p>This page verifies that the Next.js site is deployed correctly to Netlify.</p>
			<p>If you can see this, the basic deployment is working!</p>
			<div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
				<h2>Environment Check</h2>
				<p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
				<p><strong>Storyblok Region:</strong> {process.env.STORYBLOK_REGION}</p>
				<p><strong>Preview Mode:</strong> {process.env.STORYBLOK_IS_PREVIEW}</p>
			</div>
		</div>
	);
}