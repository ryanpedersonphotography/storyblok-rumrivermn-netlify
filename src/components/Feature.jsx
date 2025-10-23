import { storyblokEditable } from '@storyblok/react/rsc';

const Feature = ({ blok }) => {
	// Use Storyblok icon if provided, otherwise use default
	const iconUrl = blok.icon?.filename || '/images/default-icon.jpg';
	const iconAlt = blok.icon?.alt || blok.name || 'Feature icon';
	
	return (
		<div className="feature" {...storyblokEditable(blok)} style={{ 
			padding: '1.5rem', 
			border: '1px solid #e0e0e0', 
			borderRadius: '8px',
			textAlign: 'center',
			backgroundColor: '#fafafa'
		}}>
			<div style={{ marginBottom: '1rem' }}>
				<img 
					src={iconUrl} 
					alt={iconAlt} 
					style={{ 
						width: '64px', 
						height: '64px', 
						objectFit: 'cover',
						borderRadius: '8px'
					}}
				/>
				{!blok.icon?.filename && (
					<p style={{ 
						fontSize: '0.7rem', 
						color: '#aaa', 
						marginTop: '0.3rem',
						fontStyle: 'italic'
					}}>
						Default icon
					</p>
				)}
			</div>
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
