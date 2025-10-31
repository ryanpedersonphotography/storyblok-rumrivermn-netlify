import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
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
					{/* Navbar removed from root layout - each route renders its own */}
					{children}
				</body>
			</html>
		</StoryblokProvider>
	);
}
