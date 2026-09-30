'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Sparkles, Wind, ShieldCheck, Feather, Layers } from 'lucide-react'

export function MaterialAnatomy() {
  const [activeLayer, setActiveLayer] = useState(0)

  const layers = [
    {
      title: 'Belgian Organic Tencel & Wool Quilt',
      thickness: '2.5 cm',
      role: 'Surface Softness & Thermal Dissipation',
      description: 'Spun from sustainably harvested eucalyptus wood pulp and quilted with natural wool. Silky to the touch, wicking moisture away twice as fast as cotton to keep your skin dry in humid weather.',
      icon: Feather,
    },
    {
      title: 'Talalay Latex Pressure-Relief Pillowtop',
      thickness: '5.0 cm',
      role: 'Shoulder & Hip Contouring',
      description: 'Manufactured through gentle flash-freezing to produce a buoyant, cloud-like consistency. Distributes heavy pressure at the shoulders and pelvis so you never wake with pins and needles.',
      icon: Layers,
    },
    {
      title: '7-Zone High-Density Dunlop Latex Core',
      thickness: '20.0 cm',
      role: 'Neutral Spinal Alignment',
      description: 'Differing pinhole densities create targeted ergonomic support: softer at the head and shoulders, firmest at the lumbar spine, and medium support beneath the thighs and feet.',
      icon: ShieldCheck,
    },
    {
      title: 'Continuous Airflow Pin-Hole Matrix',
      thickness: 'Built-in',
      role: 'Natural Convection Cooling',
      description: 'Over 10,000 open air ventilation channels dispel ambient body heat with every breath you take, ensuring the core remains naturally temperature-neutral throughout the night.',
      icon: Wind,
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Ergonomic Architecture</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            The Anatomy of Restful Sleep
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-3 leading-relaxed">
            Unlike mass-produced polyurethane foam that traps moisture and breaks down in 3 years, KAMAAR Beddings uses certified 100% organic natural latex engineered for 15+ years of resilient support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Layer Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {layers.map((layer, idx) => {
              const Icon = layer.icon
              const isSelected = activeLayer === idx
              return (
                <div
                  key={idx}
                  onClick={() => setActiveLayer(idx)}
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cream border-forest shadow-card'
                      : 'bg-warmwhite border-borderLight hover:bg-cream-light hover:border-gold'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-forest text-gold' : 'bg-cream text-charcoal-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                          Layer {idx + 1} &bull; {layer.thickness}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-charcoal mt-0.5">
                        {layer.title}
                      </h4>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        {layer.role}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Detailed Layer Visual Showcase */}
          <div className="lg:col-span-7 bg-cream-light rounded-2xl border border-borderLight p-6 sm:p-8 flex flex-col justify-between shadow-card">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-cream border border-borderLight mb-6">
              <Image
                src="https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1200&q=80"
                alt={layers[activeLayer].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-warmwhite">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest-dark">
                  Layer Focus: #{activeLayer + 1}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1">
                  {layers[activeLayer].title}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                Engineering & Sleep Benefits
              </h4>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {layers[activeLayer].description}
              </p>

              <div className="pt-4 border-t border-borderLight grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-base sm:text-lg font-bold text-forest block">100%</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">Organic Latex</span>
                </div>
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-base sm:text-lg font-bold text-forest block">Zero</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">VOC Off-Gassing</span>
                </div>
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-base sm:text-lg font-bold text-forest block">12 Years</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">Core Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
