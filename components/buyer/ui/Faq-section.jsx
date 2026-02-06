"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/buyer/ui/accordion";
import { injectBrandIntoFaqs, BRAND_FAQS } from "@/lib/faq-content";

export function FAQSection({ brand = "PARTO" }) {
  const faqs = injectBrandIntoFaqs(BRAND_FAQS, brand);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl uppercase italic">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium">
            Answers to common questions buyers have before requesting{" "}
            <span className="font-bold text-orange-600">{brand}</span> spare
            parts.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-slate-200 rounded-xl bg-white px-6 py-1 transition-all hover:border-orange-200 shadow-sm"
            >
              <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline hover:text-orange-600 transition-colors uppercase text-sm tracking-tight">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 text-slate-500 font-medium text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* FAQ Schema Markup for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
