/* ALTERNATING BLOCKS SECTION - Clean Version
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
    <section className="alternating-blocks">
      <div className="alternating-blocks__content-wrapper">
        <div className="alternating-blocks__section-header">
          <div className="alternating-blocks__script-accent">{data.sectionHeader.scriptAccent}</div>
          <h2 className="alternating-blocks__section-title">{data.sectionHeader.title}</h2>
          <p className="alternating-blocks__lead">{data.sectionHeader.description}</p>
        </div>

        <div className="alternating-blocks__container">
          {data.blocks.map((block, index) => (
            <div key={index} className={`alternating-blocks__item${block.isReverse ? ' alternating-blocks__item--reverse' : ''}`}>
              <div className="alternating-blocks__content">
                <div className="alternating-blocks__number">{block.number}</div>
                <h3 className="alternating-blocks__title">{block.title}</h3>
                <p className="alternating-blocks__lead">{block.lead}</p>
                {block.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="alternating-blocks__paragraph" dangerouslySetInnerHTML={{ __html: String(paragraph) }} />
                ))}
              </div>
              <div className="alternating-blocks__image">
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
