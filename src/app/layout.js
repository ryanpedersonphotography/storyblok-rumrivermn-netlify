// 1. TOKENS - Design tokens (OKLCH colors, surfaces, gradients, spacing)
import '@/styles/tokens/theme.css'
import '@/styles/tokens/spacing.css'

// 2. PRIMITIVES - Layout primitives and component primitives (stack, cluster, grid, button)
import '@/styles/primitives/index.css'

// 3. UTILITIES - Section presets and layout utilities (@layer utilities)
import '@/styles/system/section-presets.css'
import '@/styles/system/layout.css'

// 4. GLOBALS - Base styles
import '@/styles/globals.css'

// 5. COMPONENTS - Component-specific styles (@layer components)
import '@/styles/components/buttons.css'
import '@/styles/components/section.css'
import '@/styles/components/section.variants.css'
import '@/styles/components/section.wrapper.css'
import '@/styles/components/navbar.css'
import '@/styles/components/hero.css'
import '@/styles/components/experience.css'
import '@/styles/components/spaces.css'
import '@/styles/components/gallery.css'
import '@/styles/components/alternating-blocks.css'
import '@/styles/components/brand-proof.css'
import '@/styles/components/pricing.css'
import '@/styles/components/schedule-form.css'
import '@/styles/components/map.css'
import '@/styles/components/footer.css'
import '@/styles/components/faq.css'

import StoryblokProvider from '@/components/StoryblokProvider';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { playfairDisplay, montserrat, dancingScript } from './fonts';
import Navbar from '@/components/clean/Navbar';
import ThemeSelect from '@/components/dev/ThemeSelect';

const isDev = process.env.NODE_ENV !== 'production';

export const metadata = {
	title: 'Rum River Barn | Wedding Venue',
	description: 'Experience your dream wedding at Rum River Barn, a romantic venue in Minnesota',
};

/*
 * DEV SERVER: http://localhost:6666
 * CLEAN ARCHITECTURE: All components migrated to clean tokenized system
 * - All sections use clean design tokens and components
 * - Responsive design with semantic styling
 */

export default function RootLayout({ children }) {
	return (
		<StoryblokProvider>
			<html
				lang="en"
				className={`${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`}
				suppressHydrationWarning
			>
				<head>
					<script src="//instant.page/5.2.0" type="module" integrity="sha384-jnZyxPjiipYXnSU0ygqeac2q7CVYMbh84q0uHVRRxEtvFPiQYbXWUorga2aqZJ0z"></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `
(function(){
  try{
		var d = document.documentElement;
		var params = new URLSearchParams(window.location.search);

		// Theme (light/dark)
		var theme = params.get('theme');
		var allowedTheme = theme === 'dark' || theme === 'light' ? theme : null;
		if(!allowedTheme){
			allowedTheme = localStorage.getItem('rr.theme');
			if(!allowedTheme){
				allowedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
		} else {
			localStorage.setItem('rr.theme', allowedTheme);
		}
		d.setAttribute('data-theme', allowedTheme);

		// Brand (romantic/modern) - default to romantic for public site
		var brandParam = params.get('brand');
		var allowedBrand = brandParam === 'romantic' || brandParam === 'modern' ? brandParam : null;
		if(!allowedBrand){
			allowedBrand = localStorage.getItem('rr.brand') || 'romantic';
		} else {
			localStorage.setItem('rr.brand', allowedBrand);
		}
		d.setAttribute('data-brand', allowedBrand);
  }catch(e){}
})();
`}}
					/>
				</head>
				<body>
					<ThemeProvider>
						<div data-clean-root="true">
							<Navbar />
							{children}
						</div>
					{isDev ? <ThemeSelect /> : null}
					</ThemeProvider>
				</body>
			</html>
		</StoryblokProvider>
	);
}
