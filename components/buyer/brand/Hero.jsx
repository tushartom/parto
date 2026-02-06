export function BrandHero({ brand }) {
  return (
    <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {brand.name} Spare Parts <span className="text-orange-600">Online in India</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Find genuine and used {brand.name} spare parts by connecting with verified {brand.name} spare-part sellers
            across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition">
              Find Your Parts
            </button>
          </div>
        </div>

        {/* Right Side - High Quality Car Parts Image */}
        <div className="hidden md:flex items-center justify-center">
          
        </div>
      </div>
    </section>
  )
}
