import { storyblokEditable } from '@storyblok/react/rsc';

const Teaser = ({ blok }) => {
	// Use Storyblok image if provided, otherwise use default
	const imageUrl = blok.image?.filename || '/images/default-hero.jpg';
	const imageAlt = blok.image?.alt || blok.headline || 'Hero image';
	
	return (
		<div className="teaser" {...storyblokEditable(blok)} style={{ textAlign: 'center', padding: '2rem' }}>
			<div style={{ marginBottom: '1rem' }}>
				<img 
					src={imageUrl} 
					alt={imageAlt} 
					style={{ 
						maxWidth: '100%', 
						height: 'auto', 
						borderRadius: '8px',
						boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
						maxHeight: '400px',
						objectFit: 'cover'
					}}
				/>
				{!blok.image?.filename && (
					<p style={{ 
						fontSize: '0.8rem', 
						color: '#999', 
						marginTop: '0.5rem',
						fontStyle: 'italic'
					}}>
						Default image - upload your own in Storyblok!
					</p>
				)}
			</div>
			<h1 style={{ margin: '0', color: '#333' }}>{blok.headline}</h1>
			{blok.description && (
				<p style={{ 
					marginTop: '1rem', 
					fontSize: '1.1rem', 
					color: '#666',
					maxWidth: '600px',
					margin: '1rem auto 0'
				}}>
					{blok.description}
				</p>
			)}
		</div>
	);
};

export default Teaser;
