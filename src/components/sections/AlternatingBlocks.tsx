/* ALTERNATING BLOCKS SECTION - Home Page
 * Two-column alternating layout blocks with venue information
 * Dependencies: alternating-blocks CSS classes
 */

'use client'
import { StoryblokRichText } from '@storyblok/react/rsc';

export interface AlternatingBlocksData {
  sectionHeader: {
    scriptAccent: string;
    title: string;
    description: string;
  };
  blocks: Array<{
    number: string;
    title: string;
    lead: string;
    content: any[]; // Rich text objects from Storyblok
    image: string;
    imageAlt: string;
    isReverse?: boolean;
  }>;
}

interface AlternatingBlocksProps {
  data: AlternatingBlocksData;
}

export function AlternatingBlocks({ data }: AlternatingBlocksProps) {
  return (
    <section className="hotfix-alternating-blocks">
      <div className="hotfix-content-wrapper">
        <div className="hotfix-section-header">
          <div className="hotfix-script-accent">{data.sectionHeader.scriptAccent}</div>
          <h2 className="hotfix-section-title">{data.sectionHeader.title}</h2>
          <p className="hotfix-lead">{data.sectionHeader.description}</p>
        </div>

        <div className="hotfix-blocks-container">
          {data.blocks.map((block, index) => (
            <div key={index} className={`hotfix-block-item${block.isReverse ? ' reverse' : ''}`}>
              <div className="hotfix-block-content">
                <div className="hotfix-number">{block.number}</div>
                <h3>{block.title}</h3>
                <p className="hotfix-block-lead">{block.lead}</p>
                {block.content.map((paragraph, pIndex) => (
                  <div key={pIndex}>
                    {(typeof paragraph === 'object' && paragraph.text) 
                      ? <StoryblokRichText doc={paragraph.text as any} />
                      : <p dangerouslySetInnerHTML={{ __html: String(paragraph) }} />
                    }
                  </div>
                ))}
              </div>
              <div className="hotfix-block-image">
                <img 
                  src={block.image}
                  alt={block.imageAlt}
                  width="800" 
                  height="500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AlternatingBlocks;