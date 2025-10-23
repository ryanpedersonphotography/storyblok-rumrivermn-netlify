import { storyblokEditable } from '@storyblok/react/rsc';

const Feature = ({ blok }) => {
	return (
		<div className="feature" {...storyblokEditable(blok)} style={{ 
			padding: '1.5rem', 
			border: '1px solid #e0e0e0', 
			borderRadius: '8px',
			textAlign: 'center',
			backgroundColor: '#fafafa'
		}}>
			{blok.icon?.filename && (
				<div style={{ marginBottom: '1rem' }}>
					<img 
						src={blok.icon.filename} 
						alt={blok.icon.alt || blok.name} 
						style={{ 
							width: '64px', 
							height: '64px', 
							objectFit: 'contain',
							borderRadius: '8px'
						}}
					/>
				</div>
			)}
			<h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{blok.name}</h3>
			{blok.description && (
				<p style={{ 
					margin: '0', 
					color: '#666',
					fontSize: '0.9rem',
					lineHeight: '1.4'
				}}>
					{blok.description}
				</p>
			)}
		</div>
	);
};

export default Feature;
