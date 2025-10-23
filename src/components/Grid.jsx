import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';

const Grid = ({ blok }) => (
	<div {...storyblokEditable(blok)} className="grid" style={{
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: '2rem',
		padding: '2rem',
		maxWidth: '1200px',
		margin: '0 auto'
	}}>
		{blok.columns.map((nestedBlok) => (
			<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
		))}
	</div>
);

export default Grid;
