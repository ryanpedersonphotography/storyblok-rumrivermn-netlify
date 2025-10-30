'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is included in your venue rental?',
      answer: 'Our venue rental includes exclusive use of the barn and grounds for your event day, tables and chairs for up to 200 guests, setup and cleanup services, and access to our bridal suite and groom\'s quarters.'
    },
    {
      question: 'Do you provide catering services?',
      answer: 'Yes! We offer full catering services through our preferred vendors, or you\'re welcome to bring in your own licensed caterer. Our professional kitchen facilities can accommodate any culinary vision.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We require a non-refundable deposit to secure your date. Our full cancellation policy will be provided in your contract, and we recommend wedding insurance for peace of mind.'
    },
    {
      question: 'Can we have our ceremony on-site?',
      answer: 'Absolutely! We have beautiful ceremony locations both indoors and outdoors. Our scenic riverside setting provides a stunning backdrop for your vows.'
    },
    {
      question: 'Is there parking available?',
      answer: 'Yes, we provide ample free parking for all your guests on-site, including accessible parking spots near the entrance.'
    }
  ];

  return (
    <section className="faq">
      <div className="faq__container">
        <div className="faq__header">
          <span className="faq__script">Questions?</span>
          <h2 className="faq__title">Frequently Asked Questions</h2>
        </div>

        <div className="faq__items">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq__item ${openIndex === index ? 'active' : ''}`}>
              <div
                className="faq__question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3>{faq.question}</h3>
                <div className="faq__toggle">
                  <ChevronDownIcon className="w-6 h-6" />
                </div>
              </div>
              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
