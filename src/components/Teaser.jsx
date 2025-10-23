import { storyblokEditable } from '@storyblok/react/rsc';

const Teaser = ({ blok }) => {
	return (
		<div className="teaser" {...storyblokEditable(blok)} style={{ textAlign: 'center', padding: '2rem' }}>
			{blok.image?.filename && (
				<div style={{ marginBottom: '1rem' }}>
					<img 
						src={blok.image.filename} 
						alt={blok.image.alt || blok.headline} 
						style={{ 
							maxWidth: '100%', 
							height: 'auto', 
							borderRadius: '8px',
							boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
						}}
					/>
				</div>
			)}
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
