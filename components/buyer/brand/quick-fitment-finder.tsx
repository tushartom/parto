"use client"

import { useState } from "react"

export function QuickFitmentFinder({ brand }) {
  const [formData, setFormData] = useState({
    model: "",
    year: "",
    fuelType: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <div className="bg-slate-900 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide">Quick Fitment Finder</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 uppercase">Model</label>
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-orange-600 focus:outline-none"
            >
              <option value="">Select Model</option>
              <option value="fortuner">Fortuner</option>
              <option value="innova">Innova</option>
              <option value="camry">Camry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 uppercase">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-orange-600 focus:outline-none"
            >
              <option value="">Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 uppercase">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-orange-600 focus:outline-none"
            >
              <option value="">Select Fuel</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-6 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700 transition">
              Search Parts
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
