import Link from 'next/link';

export default async function TokenTest() {
  const token = process.env.STORYBLOK_ACCESS_TOKEN;
  const isPreview = process.env.STORYBLOK_IS_PREVIEW;
  const region = process.env.STORYBLOK_REGION;
  
  let testResult = null;
  let error = null;

  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/home?token=${token}&version=draft&cv=${Date.now()}`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const data = await response.json();
      testResult = {
        status: 'SUCCESS',
        storyName: data.story.name,
        published_at: data.story.published_at,
        headline: data.story.content.body[0]?.headline
      };
    } else {
      testResult = {
        status: 'ERROR',
        httpStatus: response.status,
        message: await response.text()
      };
    }
  } catch (err) {
    error = err.message;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔬 Live Token Test</h1>
      
      <div style={{ marginBottom: '20px', background: '#f0f0f0', padding: '15px' }}>
        <h3>Environment Variables (Live):</h3>
        <p><strong>Token:</strong> {token}</p>
        <p><strong>Preview Mode:</strong> {isPreview}</p>
        <p><strong>Region:</strong> {region}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>

      <div style={{ marginBottom: '20px', background: testResult?.status === 'SUCCESS' ? '#d4edda' : '#f8d7da', padding: '15px' }}>
        <h3>API Test Result:</h3>
        <pre>{JSON.stringify(testResult, null, 2)}</pre>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>

      <p><Link href="/">← Back to Home</Link></p>
    </div>
  );
}