import './globals.css';
import '@/styles/hotfix/design-tokens.css';
import '@/styles/hotfix/animations.css';
import '@/styles/hotfix/icon-system.css';
import '@/styles/hotfix/navbar-styles.css';
import '@/styles/hotfix/theme-toggle-styles.css';
import '@/styles/hotfix/hero-styles.css';
import '@/styles/hotfix/alternating-blocks-styles.css';
import '@/styles/hotfix/rum-river-experience-styles.css';
import '@/styles/hotfix/love-stories-gallery-styles.css';
import '@/styles/hotfix/brand-social-proof-styles.css';
import '@/styles/hotfix/testimonials-styles.css';
import '@/styles/hotfix/history-carousel-styles.css';
import '@/styles/hotfix/schedule-form-styles.css';
import '@/styles/hotfix/map-section-styles.css';
import '@/styles/hotfix/faq-accordion-styles.css';
import '@/styles/hotfix/pricing-styles.css';
import '@/styles/hotfix/footer-styles.css';
import '@/styles/hotfix/spaces-styles.css';
/* Media darken utilities - before dark tokens */
import '@/styles/hotfix/media-darken.css';
/* Dark tokens LAST - must win cascade */
import '@/styles/hotfix/tokens-dark.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import NavbarHotfix from '@/components/hotfix/NavbarHotfix';
import { playfairDisplay, montserrat, dancingScript } from './fonts';

export const metadata = {
	title: 'Rum River Barn | Wedding Venue',
	description: 'Experience your dream wedding at Rum River Barn, a romantic venue in Minnesota',
};

/*
 * DEV SERVER: http://localhost:6666
 * HOTFIX COMPONENTS: Available at /beta route
 * - NavbarHotfix + HeroHotfix with romantic wedding theme
 * - Pixel-perfect fidelity to original design
 */

export default function RootLayout({ children }) {
	const currentYear = new Date().getFullYear();
	return (
		<StoryblokProvider>
			<html
				lang="en"
				className={`${playfairDisplay.variable} ${montserrat.variable} ${dancingScript.variable}`}
			>
				<head>
					<script
						dangerouslySetInnerHTML={{
							__html: `
(function () {
  try {
    var KEY="theme-mode";
    var m=localStorage.getItem(KEY)||"auto";
    var d=window.matchMedia("(prefers-color-scheme: dark)").matches;
    var forced=(m==="dark"||m==="light")?m:null;
    if (forced) {
      document.documentElement.setAttribute("data-theme", forced);
      document.documentElement.style.colorScheme = forced;
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.style.colorScheme = d ? "dark" : "light";
    }
  } catch(e) {}
})();
`}}
					/>
				</head>
				<body>
					<NavbarHotfix />
					{children}
				</body>
			</html>
		</StoryblokProvider>
	);
}
