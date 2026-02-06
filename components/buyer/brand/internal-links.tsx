export function InternalLinks({ brand, models }) {
  const modelCategories = {
    SUVs: [models[0], models[5]],
    MPVs: [models[1]],
    Sedans: [models[2], models[4]],
    "Compact Cars": [models[3]],
  }

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto border-t border-slate-200">
      <h2 className="text-3xl font-bold mb-10 uppercase tracking-wide text-slate-900">
        Popular {brand.name} Spare Parts by Model
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Object.entries(modelCategories).map(([category, categoryModels]) => (
          <div key={category}>
            <h3 className="font-bold text-lg text-slate-900 mb-4 uppercase text-sm tracking-wide border-b-2 border-orange-600 pb-2">
              {category}
            </h3>
            <ul className="space-y-2">
              {categoryModels.map((model) => (
                <li key={model.id}>
                  <a
                    href={`/spare-parts/${brand.slug}/${model.slug}`}
                    className="text-orange-600 hover:text-orange-700 hover:underline text-sm"
                  >
                    {brand.name} {model.name} spare parts
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SEO-focused footer section */}
      <div className="mt-16 pt-12 border-t border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wide">More Resources</h3>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          PARTO is India's most trusted marketplace for {brand.name} spare parts. Whether you're looking for engine
          parts, transmission components, suspension systems, or body parts, our verified network of suppliers ensures
          you get genuine products at competitive prices. Find {brand.name} spare parts online with confidence today.
        </p>
      </div>
    </section>
  )
}
