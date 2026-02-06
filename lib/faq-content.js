export const BRAND_FAQS = [
  {
    question: "Do you sell {{brand}} spare parts directly?",
    answer:
      "No. PARTO does not sell spare parts. We connect buyers with verified {{brand}} spare-part suppliers who contact you directly.",
  },
  {
    question: "How will sellers contact me?",
    answer:
      "Interested sellers contact you directly via WhatsApp or phone based on the information you provide in your request.",
  },
  {
    question: "Will multiple sellers contact me?",
    answer:
      "Yes. Multiple verified sellers may contact you with offers. You can compare options and choose the best one for your needs.",
  },
  {
    question: "Are used {{brand}} spare parts safe to buy?",
    answer:
      "When purchased from verified sellers, used spare parts can be reliable and cost-effective. We recommend asking sellers about the condition and warranty.",
  },
  {
    question: "Is there any cost to submit a request?",
    answer:
      "No. Submitting a request is completely free. You only pay when you decide to purchase from a seller.",
  },
];

// Brand injection helper
export const injectBrandIntoFaqs = (faqs, brand) => {
  return faqs.map((faq) => ({
    question: faq.question.replace(/\{\{brand\}\}/g, brand),
    answer: faq.answer.replace(/\{\{brand\}\}/g, brand),
  }));
};
