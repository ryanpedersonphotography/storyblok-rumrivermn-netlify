/* ALTERNATING BLOCKS SECTION - Home Page
 * Two-column alternating layout blocks with venue information
 * Dependencies: alternating-blocks CSS classes
 */

'use client'

import React from 'react'
import { hotfixAlternatingBlocks } from '../hotfix/hotfixStaticContent'

type Props = { data?: typeof hotfixAlternatingBlocks }

export default function AlternatingBlocks({ data = hotfixAlternatingBlocks }: Props) {
  console.log('AlternatingBlocks received data:', JSON.stringify(data, null, 2));
  
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
                  <p key={pIndex} dangerouslySetInnerHTML={{ __html: String(paragraph) }} />
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