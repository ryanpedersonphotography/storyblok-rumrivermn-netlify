/* EXPERIENCE SECTION - Clean Version
 * Two-column layout with feature grid and image
 * Dependencies: experience CSS classes
 */

'use client'

import { SparklesIcon, StarIcon, HeartIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

export default function Experience() {
  const features = [
    {
      icon: SparklesIcon,
      title: 'Natural Beauty',
      description: 'Surrounded by pristine woodlands and the scenic Rum River'
    },
    {
      icon: StarIcon,
      title: 'Authentic Charm',
      description: 'Rustic elegance that captures the spirit of Minnesota'
    },
    {
      icon: HeartIcon,
      title: 'Personal Touch',
      description: 'Dedicated team committed to bringing your vision to life'
    },
    {
      icon: CheckBadgeIcon,
      title: 'Complete Experience',
      description: 'Everything you need for an unforgettable celebration'
    }
  ];

  return (
    <section className="experience">
      <div className="experience__container">
        <div className="experience__content">
          <div className="experience__header">
            <p className="experience__script">The Rum River Experience</p>
            <h2 className="experience__title">More Than a Venue</h2>
            <p className="experience__description">
              At Rum River Barn, we believe your wedding day should be more than just beautiful—it should be unforgettable.
              Nestled along the banks of the historic Rum River, our venue offers a unique blend of rustic charm and natural
              elegance that creates the perfect backdrop for your love story.
            </p>
          </div>

          <div className="experience__features">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="experience__feature">
                  <div className="experience__icon">
                    <IconComponent className="icon-svg" />
                  </div>
                  <div className="experience__text">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="experience__image">
          <img
            src="https://images.ctfassets.net/qqjgd2e69j47/3q98p75VUiiBiTC5g8CIwr/e98b7c0f292754187fd889300705524e/wedding-celebration.jpg"
            alt="Wedding celebration at Rum River Barn"
            className="experience__img"
          />
        </div>
      </div>
    </section>
  );
}
