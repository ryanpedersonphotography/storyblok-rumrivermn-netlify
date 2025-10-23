export default function ApiTestPage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem' }}>
      <h1>Storyblok API Test</h1>
      <p>Testing API connectivity for rum-river-mn space</p>
      
      <div id="results">
        {/* Tests will be populated by client-side JavaScript */}
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          const TOKEN = '[REMOVED - see STORYBLOK_TOKENS.md]';
          const SPACE_ID = '287999131965922';
          
          async function testEndpoint(name, url) {
            const resultDiv = document.createElement('div');
            resultDiv.style.cssText = 'background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-radius: 4px;';
            resultDiv.innerHTML = '<h3>' + name + '</h3><p>Testing: <code style="background: #e9ecef; padding: 0.2rem 0.4rem; border-radius: 3px;">' + url + '</code></p>';
            document.getElementById('results').appendChild(resultDiv);
            
            try {
              const response = await fetch(url);
              const data = await response.text();
              
              if (response.ok) {
                resultDiv.style.background = '#d4edda';
                resultDiv.style.border = '1px solid #c3e6cb';
                resultDiv.innerHTML += '<p><strong>✅ Success (' + response.status + ')</strong></p><pre style="background: white; padding: 0.5rem; border-radius: 3px; overflow: auto;">' + data + '</pre>';
              } else {
                resultDiv.style.background = '#f8d7da';
                resultDiv.style.border = '1px solid #f5c6cb';
                resultDiv.innerHTML += '<p><strong>❌ Error (' + response.status + ')</strong></p><pre style="background: white; padding: 0.5rem; border-radius: 3px; overflow: auto;">' + data + '</pre>';
              }
            } catch (error) {
              resultDiv.style.background = '#f8d7da';
              resultDiv.style.border = '1px solid #f5c6cb';
              resultDiv.innerHTML += '<p><strong>❌ Network Error</strong></p><pre style="background: white; padding: 0.5rem; border-radius: 3px;">' + error.message + '</pre>';
            }
          }
          
          // Run tests when page loads
          window.addEventListener('load', async function() {
            await testEndpoint('EU Region - Space Info', 'https://api.storyblok.com/v2/cdn/spaces/me?token=' + TOKEN);
            await testEndpoint('EU Region - Stories List', 'https://api.storyblok.com/v2/cdn/stories?token=' + TOKEN);
            await testEndpoint('EU Region - Home Story', 'https://api.storyblok.com/v2/cdn/stories/home?token=' + TOKEN);
            await testEndpoint('US Region - Space Info', 'https://api-us.storyblok.com/v2/cdn/spaces/me?token=' + TOKEN);
          });
        `
      }} />
    </div>
  );
}