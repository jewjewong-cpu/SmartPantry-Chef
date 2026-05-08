import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import stitchScreen from '../assets/stitch/screen.png'
import trendingReference from '../assets/stitch/trending-reference.png'
import roastedPumpkinSoup from '../assets/stitch/roasted-pumpkin-soup.png'
import cinnamonAppleTart from '../assets/stitch/cinnamon-apple-tart.png'
import slowCookerBeefStew from '../assets/stitch/slow-cooker-beef-stew.png'
import autumnHarvestBowl from '../assets/stitch/autumn-harvest-bowl.png'
import homeHero from '../assets/stitch/home-hero.png'
import avocadoToastWithEgg from '../assets/stitch/avocado-toast-with-egg.png'
import onePanVeggieStirFry from '../assets/stitch/one-pan-veggie-stir-fry.png'
import garlicOliveOilPasta from '../assets/stitch/garlic-olive-oil-pasta.png'

export default function OpeningPage() {
  const navigate = useNavigate()
  const [savedTrending, setSavedTrending] = useState<Record<string, boolean>>({})
  const [heroImageReady, setHeroImageReady] = useState(false)

  useEffect(() => {
    // Ensure we're at the top when arriving here.
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    // If image load events are delayed (cache quirks), still fade in shortly.
    const t = window.setTimeout(() => setHeroImageReady(true), 600)
    return () => window.clearTimeout(t)
  }, [])

  // The provided design zip includes a single reference screenshot.
  // We reuse it as a sprite-sheet and "crop" the card thumbnail regions via background positioning.
  const cropFromDesign = (posX: string, posY: string) =>
    ({
      backgroundImage: `url(${stitchScreen})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      backgroundPosition: `${posX} ${posY}`,
    }) as const

  const trendingCards = useMemo(() => {
    // Match the reference screenshot exactly.
    return [
      { id: 'pumpkin-soup', title: 'Roasted Pumpkin Soup', timeLabel: '45m', badge: 'FALL FAV' },
      { id: 'apple-tart', title: 'Cinnamon Apple Tart', timeLabel: '60m', badge: null },
      { id: 'beef-stew', title: 'Slow-Cooker Beef Stew', timeLabel: '6h', badge: null },
      { id: 'autumn-bowl', title: 'Autumn Harvest Bowl', timeLabel: '25m', badge: null },
    ] as const
  }, [])

  function trendingImageStyle(index: number) {
    if (index === 0) {
      return {
        backgroundImage: `url(${roastedPumpkinSoup})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } as const
    }
    if (index === 1) {
      return {
        backgroundImage: `url(${cinnamonAppleTart})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } as const
    }
    if (index === 2) {
      return {
        backgroundImage: `url(${slowCookerBeefStew})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } as const
    }
    if (index === 3) {
      return {
        backgroundImage: `url(${autumnHarvestBowl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } as const
    }

    // `trending-reference.png` is the exact section screenshot with the 4 images.
    // Use it as a 4-column sprite: each card shows one quarter.
    const x =
      index === 0 ? '0%' : index === 1 ? '33.333%' : index === 2 ? '66.666%' : '100%'
    return {
      backgroundImage: `url(${trendingReference})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '400% 100%',
      backgroundPosition: `${x} 0%`,
    } as const
  }

  return (
    <div className="min-h-dvh bg-[#fefae0] text-[#1d1c0d]">
      <main className="mx-auto w-full max-w-[1200px] px-[24px] pb-14 pt-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-[#f2efd5]/50 p-8 shadow-sm">
          <img
            src={homeHero}
            alt=""
            className={[
              'pointer-events-none absolute inset-0 h-full w-full object-cover',
              'transition-opacity duration-700 ease-out',
              heroImageReady ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            onLoad={() => setHeroImageReady(true)}
            loading="eager"
            decoding="async"
          />
          {/* Soft fade for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fefae0]/90 via-[#fefae0]/70 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(1200px 420px at 20% 20%, rgba(215,170,120,0.22), rgba(215,170,120,0) 60%), radial-gradient(900px 360px at 85% 45%, rgba(132,158,91,0.18), rgba(132,158,91,0) 55%)',
            }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[560px]">
              <h1 className="font-['Literata'] text-[40px] font-bold leading-[1.1] tracking-tight text-[#8d4b00] sm:text-[46px]">
                Welcome Home to
                <br />
                SmartPantry
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#554336]">
                Nurturing your kitchen, one meal at a time.
              </p>
              <button
                type="button"
                onClick={() => navigate('/pantry')}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#8d4b00] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#7a4500] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
              >
                Start Cooking <span aria-hidden="true" className="ml-2">!!</span>
              </button>
            </div>
          </div>
        </section>

        {/* Meal plan + tips */}
        <section className="mt-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-['Literata'] text-3xl font-semibold leading-tight tracking-tight text-[#1d1c0d] sm:text-4xl">
                  Today's Meal Plan
                </h2>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-semibold text-[#586330] transition hover:text-[#404b1b] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
                aria-label="View full week meal plan"
              >
                View Full Week <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'BREAKFAST',
                  title: 'Avocado Toast With Egg',
                  meta: '15 mins • Healthy',
                  imgPos: {
                    backgroundImage: `url(${avocadoToastWithEgg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } as const,
                },
                {
                  label: 'LUNCH',
                  title: 'One-Pan Veggie Stir Fry',
                  meta: '10 mins • Quick',
                  imgPos: {
                    backgroundImage: `url(${onePanVeggieStirFry})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } as const,
                },
                {
                  label: 'DINNER',
                  title: 'Garlic Olive Oil Pasta',
                  meta: '35 mins • Chef Choice',
                  imgPos: {
                    backgroundImage: `url(${garlicOliveOilPasta})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } as const,
                },
              ].map((m) => (
                <article
                  key={m.label}
                  className="rounded-[1.5rem] bg-white/60 p-3 shadow-sm ring-1 ring-white/60"
                >
                  <div
                    className="relative h-44 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#ede9cf] to-[#f2efd5]"
                    style={m.imgPos}
                  >
                    <div className="absolute left-3 top-3 rounded-full bg-[#586330] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {m.label}
                    </div>
                    {/* Soft wash to match the design's gentle lighting. */}
                    <div className="absolute inset-0 bg-[#fefae0]/30 opacity-80" />
                  </div>

                  <div className="mt-3">
                    <p className="font-['Literata'] text-2xl font-semibold leading-tight tracking-tight text-[#1d1c0d]">
                      {m.title}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#554336]">
                      {m.meta}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <aside className="rounded-[1.5rem] bg-white/60 p-5 shadow-sm ring-1 ring-white/60">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[#586330]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-4.35-7-10a7 7 0 0 1 14 0c0 5.65-7 10-7 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
                <h3 className="font-['Literata'] text-lg font-semibold text-[#8d4b00]">
                  Quick Pantry Tips
                </h3>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#554336]">
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#8d4b00]" />
                  Store your tomatoes at room temperature to preserve their flavor and texture.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#8d4b00]" />
                  Revive wilted herbs by placing them in a glass of cold water like flowers.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#8d4b00]" />
                  Label your spices with purchase dates to ensure maximum potency.
                </li>
              </ul>

              <div className="mt-5 rounded-[1.25rem] bg-white/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-[#ba1a1a]">
                    RUNNING LOW
                  </p>
                  <p className="text-xs font-semibold text-[#ba1a1a]">
                    4 items
                  </p>
                </div>

                <div className="mt-3 space-y-3">
                  {[
                    { name: 'Whole Milk', pct: 18 },
                    { name: 'Sourdough Bread', pct: 22 },
                  ].map((x) => (
                    <div key={x.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#554336]">
                          {x.name}
                        </p>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f2e9d7]">
                        <div
                          className="h-2 bg-[#ba1a1a]"
                          style={{ width: `${x.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Trending carousel */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-['Literata'] text-2xl font-semibold text-[#8d4b00]">
                Trending Seasonal Recipes
              </h2>
              <p className="mt-1 text-sm text-[#554336]">
                The freshest flavors for the month, curated for you.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/70 shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/70 shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingCards.map((card, idx) => (
              <article
                key={card.id}
                className="overflow-hidden rounded-[1.5rem] bg-white/60 shadow-sm ring-1 ring-white/60"
              >
                <div
                  className="relative h-36 bg-gradient-to-br from-[#ede9cf] to-[#f2efd5]"
                  style={trendingImageStyle(idx)}
                >
                  {card.badge ? (
                    <div className="absolute bottom-3 left-3 rounded-full bg-[#8d4b00]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                      {card.badge}
                    </div>
                  ) : null}
                </div>

                <div className="p-4">
                  <p className="font-['Literata'] text-lg font-semibold leading-6 text-[#1d1c0d]">
                    {card.title}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-[#554336]">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>{card.timeLabel}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSavedTrending((prev) => ({
                          ...prev,
                          [card.id]: !prev[card.id],
                        }))
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
                      aria-label={`${savedTrending[card.id] ? 'Unsave' : 'Save'} ${card.title}`}
                    >
                      <svg
                        className={[
                          'h-4 w-4',
                          savedTrending[card.id] ? 'text-[#586330]' : 'text-[#554336]',
                        ].join(' ')}
                        viewBox="0 0 24 24"
                        fill={savedTrending[card.id] ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200/70 pt-10">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="font-['Literata'] text-xl font-semibold text-[#8d4b00]">
                SmartPantry
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                © 2024 SmartPantry. Nurturing your home kitchen.
              </p>
            </div>

            <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
                <a href="#/" className="hover:text-zinc-900">
                  Privacy
                </a>
                <a href="#/" className="hover:text-zinc-900">
                  Terms
                </a>
                <a href="#/" className="hover:text-zinc-900">
                  Support
                </a>
                <a href="#/" className="hover:text-zinc-900">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

