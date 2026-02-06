export function BrandAuthority({ brand }) {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto border-t border-slate-200">
      <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide text-slate-900">About {brand.name} Spare Parts</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-slate-700 leading-relaxed mb-4">{brand.description}</p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Whether you need engine components, transmission parts, suspension elements, or exterior body parts, PARTO
            brings together verified suppliers who offer both genuine original parts and quality certified used
            alternatives. Our platform ensures every transaction is transparent, secure, and buyer-protected.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-8">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Why Choose PARTO?</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-slate-700">Verified seller network across India</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-slate-700">Genuine and certified parts guarantee</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-slate-700">Secure transactions with buyer protection</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-slate-700">Fast nationwide delivery options</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
