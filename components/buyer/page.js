import { BrandHero } from "@/components/buyer/brand/Hero";
import { QuickFitmentFinder } from "@/components/buyer/brand/quick-fitment-finder";
import { ModelMatrix } from "@/components/buyer/brand/ModelMatrix";
import { TrustMetrics } from "@/components/buyer/brand/TrustMetrics";
import { HowItWorks } from "@/components/buyer/brand/HowItWorks";
import { BrandAuthority } from "@/components/buyer/brand/brand-authority";
import { InternalLinks } from "@/components/buyer/brand/internal-links";
import { LeadForm } from "@/components/buyer/LeadForm";
import { FAQSection } from "@/components/buyer/ui/Faq-section";

const mockBrandData = {
  id: "1",
  name: "Toyota",
  slug: "toyota",
  description:
    "Toyota is Japan's leading automotive manufacturer with a reputation for reliability and innovation. PARTO connects you with verified sellers offering genuine and certified used Toyota spare parts across India. From engine components to body parts, find everything you need with confidence.",
};

const mockModels = [
  { id: "1", name: "Fortuner", slug: "fortuner", type: "suv" },
  { id: "2", name: "Innova Hycross", slug: "innova-hycross", type: "muv" },
  { id: "3", name: "Innova Crysta", slug: "innova-crysta", type: "muv" },
  { id: "4", name: "Hilux", slug: "hilux", type: "pickup" },
  { id: "5", name: "Camry", slug: "camry", type: "sedan" },
  { id: "6", name: "Glanza", slug: "glanza", type: "hatchback" },
  { id: "7", name: "Urban Cruiser Taisor", slug: "taisor", type: "suv" },
  { id: "8", name: "Urban Cruiser Hyryder", slug: "hyryder", type: "suv" },
  { id: "9", name: "Vellfire", slug: "vellfire", type: "luxury" },
  { id: "10", name: "Land Cruiser 300", slug: "lc300", type: "suv" },
  { id: "11", name: "Corolla Altis", slug: "altis", type: "sedan" },
  { id: "12", name: "Etios", slug: "etios", type: "sedan" },
];

const mockMetrics = {
  leadRequestCount: 45000,
  verifiedSupplierCount: 2300,
  coverageLabel: "All India",
};

export const metadata = {
  title: `${mockBrandData.name} Spare Parts Online in India | PARTO`,
  description: `Find genuine and used ${mockBrandData.name} spare parts online. Connect with verified sellers across India. Fast, safe, and reliable spare parts marketplace.`,
  keywords: `${mockBrandData.name} spare parts, automotive parts, India, verified sellers`,
};

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION WITH QUICK FITMENT FINDER */}
      <BrandHero brand={mockBrandData} />
      <LeadForm />

      {/* MODEL MATRIX GRID */}
      <ModelMatrix brand={mockBrandData} models={mockModels} />

      {/* TRUST METRICS */}
      <TrustMetrics metrics={mockMetrics} />

      {/* HOW IT WORKS */}
      <HowItWorks brand={mockBrandData} />

      {/* BRAND AUTHORITY CONTENT */}
      <BrandAuthority brand={mockBrandData} />

      {/* INTERNAL LINKS & SEO FOOTER */}
      <InternalLinks brand={mockBrandData} models={mockModels} />

      <FAQSection />
    </main>
  );
}
