import { getStoryblokApi } from '@/lib/storyblok';

export default async function DebugPage() {
  const storyblokApi = getStoryblokApi();
  
  // Environment variables check
  const envVars = {
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN || 'NOT SET',
    STORYBLOK_DELIVERY_API_TOKEN: process.env.STORYBLOK_DELIVERY_API_TOKEN || 'NOT SET',
    NEXT_PUBLIC_STORYBLOK_TOKEN: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || 'NOT SET',
    STORYBLOK_REGION: process.env.STORYBLOK_REGION || 'NOT SET',
    STORYBLOK_IS_PREVIEW: process.env.STORYBLOK_IS_PREVIEW || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  };

  // API configuration check
  const apiConfig = {
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN || process.env.STORYBLOK_DELIVERY_API_TOKEN,
    region: process.env.STORYBLOK_REGION || 'eu',
    version: process.env.STORYBLOK_IS_PREVIEW === 'yes' ? 'draft' : 'published',
  };

  // Test API calls
  let testResults = {
    stories: null,
    homeStory: null,
    errors: []
  };

  try {
    // Test 1: Get all stories (draft)
    const { data: draftStories } = await storyblokApi.get('cdn/stories/', {
      version: 'draft',
    });
    testResults.stories = {
      draft: draftStories?.stories?.length || 0,
      draftList: draftStories?.stories?.map(s => ({ 
        slug: s.slug, 
        published_at: s.published_at,
        id: s.id 
      })) || []
    };
  } catch (error) {
    testResults.errors.push(`Draft stories error: ${error.message}`);
  }

  try {
    // Test 2: Get all stories (published)
    const { data: publishedStories } = await storyblokApi.get('cdn/stories/', {
      version: 'published',
    });
    testResults.stories = {
      ...testResults.stories,
      published: publishedStories?.stories?.length || 0,
      publishedList: publishedStories?.stories?.map(s => ({ 
        slug: s.slug, 
        published_at: s.published_at,
        id: s.id 
      })) || []
    };
  } catch (error) {
    testResults.errors.push(`Published stories error: ${error.message}`);
  }

  try {
    // Test 3: Get home story (draft)
    const { data: homeDraft } = await storyblokApi.get('cdn/stories/home', {
      version: 'draft',
    });
    testResults.homeStory = {
      draft: {
        exists: !!homeDraft?.story,
        published_at: homeDraft?.story?.published_at,
        first_published_at: homeDraft?.story?.first_published_at,
        content_type: homeDraft?.story?.content?.component,
        headline: homeDraft?.story?.content?.body?.[0]?.headline
      }
    };
  } catch (error) {
    testResults.errors.push(`Home draft error: ${error.message}`);
  }

  try {
    // Test 4: Get home story (published)
    const { data: homePublished } = await storyblokApi.get('cdn/stories/home', {
      version: 'published',
    });
    testResults.homeStory = {
      ...testResults.homeStory,
      published: {
        exists: !!homePublished?.story,
        published_at: homePublished?.story?.published_at,
        first_published_at: homePublished?.story?.first_published_at,
        content_type: homePublished?.story?.content?.component,
        headline: homePublished?.story?.content?.body?.[0]?.headline
      }
    };
  } catch (error) {
    testResults.errors.push(`Home published error: ${error.message}`);
  }

  // Region test - try different regions
  let regionTests = {};
  for (const region of ['us', 'eu', 'ca', 'au', 'cn']) {
    try {
      const response = await fetch(
        `https://api${region === 'us' ? '' : `-${region}`}.storyblok.com/v2/cdn/stories?token=${apiConfig.accessToken}&version=draft`,
        { next: { revalidate: 0 } }
      );
      regionTests[region] = {
        status: response.status,
        working: response.ok
      };
    } catch (error) {
      regionTests[region] = {
        status: 'error',
        working: false,
        error: error.message
      };
    }
  }

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: '#00ff00',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#00ffff' }}>🔍 Storyblok Debug Console</h1>
      
      <section style={{ marginBottom: '30px', border: '1px solid #333', padding: '15px' }}>
        <h2 style={{ color: '#ffff00' }}>📊 Environment Variables</h2>
        <pre>{JSON.stringify(envVars, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #333', padding: '15px' }}>
        <h2 style={{ color: '#ffff00' }}>⚙️ API Configuration</h2>
        <pre>{JSON.stringify(apiConfig, null, 2)}</pre>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #333', padding: '15px' }}>
        <h2 style={{ color: '#ffff00' }}>🌍 Region Tests</h2>
        <pre>{JSON.stringify(regionTests, null, 2)}</pre>
        <p style={{ color: '#ffa500' }}>
          ✅ = Working region | ❌ = Non-working region
        </p>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #333', padding: '15px' }}>
        <h2 style={{ color: '#ffff00' }}>📚 API Test Results</h2>
        <pre>{JSON.stringify(testResults, null, 2)}</pre>
      </section>

      {testResults.errors.length > 0 && (
        <section style={{ marginBottom: '30px', border: '1px solid #ff0000', padding: '15px' }}>
          <h2 style={{ color: '#ff0000' }}>❌ Errors</h2>
          {testResults.errors.map((error, index) => (
            <div key={index} style={{ color: '#ff6666', marginBottom: '10px' }}>
              {error}
            </div>
          ))}
        </section>
      )}

      <section style={{ marginBottom: '30px', border: '1px solid #333', padding: '15px' }}>
        <h2 style={{ color: '#ffff00' }}>🔧 Recommendations</h2>
        <div style={{ color: '#ffffff' }}>
          <h3>Based on the tests above:</h3>
          <ul>
            <li>✅ Working region should be set in STORYBLOK_REGION</li>
            <li>📚 If published stories = 0 but draft stories &gt; 0: Content needs publishing</li>
            <li>🔑 If all tests fail: Check access token</li>
            <li>🌍 If only certain regions work: Update region configuration</li>
          </ul>
        </div>
      </section>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#00ffff' }}>← Back to Home</a> | 
        <a href="/test" style={{ color: '#00ffff' }}>Test Page →</a>
      </div>
    </div>
  );
}