"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/buyer/ui/accordion";

const faqs = [
  {
    question: "How does PARTO help me find car parts?",
    answer:
      "We act as a high-speed bridge between you and a nationwide network of professional spare parts suppliers. When you submit a request, we instantly alert verified sellers who stock your specific part, allowing them to provide you with the most competitive direct quotes.",
  },
  {
    question: "How are the suppliers on your platform verified?",
    answer:
      "Trust is built into our core. Every supplier on our portal must undergo a manual vetting process where we verify their business credentials, physical shop location, and inventory quality before they are allowed to bid on your requests.",
  },
  {
    question: "Do I buy the parts from PARTO or the supplier?",
    answer:
      "You buy directly from the verified supplier. PARTO is a connection platform that helps you discover the best deals; the final transaction, payment, and shipping arrangements are handled directly between you and the seller to ensure the lowest possible pricing without middleman markups.",
  },
  {
    question: "Can I request both new and second-hand parts?",
    answer:
      "Yes. Whether you are looking for a brand-new factory-boxed component or a budget-friendly used part, our network includes specialized dealers for both categories. Simply specify your preference in the request form to see available options from our sellers.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-md text-gray-600">
            Everything you need to know about PARTO
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional Help CTA */}
        {/* <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for?
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-semibold underline">
            Contact our support team
          </button>
        </div> */}
      </div>
    </section>
  );
}
