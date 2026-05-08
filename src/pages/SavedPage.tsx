import type { RecipeFeedback, RecipePrefs } from '../App'
import { mockRecipes } from '../data/mockRecipes'
import scrambledEggsImg from '../assets/stitch/recipe-scrambled-eggs.png'
import avocadoToastImg from '../assets/stitch/recipe-avocado-toast-eggs.png'
import garlicOliveOilPastaImg from '../assets/stitch/recipe-garlic-olive-oil-pasta.png'
import butteredPastaImg from '../assets/stitch/recipe-buttered-pasta.png'
import simpleFriedRiceImg from '../assets/stitch/recipe-simple-fried-rice.png'
import stirFryImg from '../assets/stitch/recipe-one-pan-stir-fry.png'
import roastedPotatoesImg from '../assets/stitch/recipe-roasted-potatoes.png'
import grilledCheeseImg from '../assets/stitch/recipe-grilled-cheese.png'
import { useMemo, useState } from 'react'

type AlbumTab = 'all' | 'saved' | 'liked' | 'disliked'

function imageForRecipe(name: string) {
  if (/scrambled eggs/i.test(name)) return scrambledEggsImg
  if (/avocado toast/i.test(name)) return avocadoToastImg
  if (/garlic olive oil pasta/i.test(name)) return garlicOliveOilPastaImg
  if (/buttered pasta/i.test(name)) return butteredPastaImg
  if (/fried rice/i.test(name)) return simpleFriedRiceImg
  if (/stir fry/i.test(name)) return stirFryImg
  if (/roasted potatoes/i.test(name)) return roastedPotatoesImg
  if (/grilled cheese/i.test(name)) return grilledCheeseImg
  return null
}

function minutesForRecipe(name: string) {
  if (/scrambled eggs/i.test(name)) return 10
  if (/avocado toast/i.test(name)) return 15
  if (/garlic olive oil pasta/i.test(name)) return 20
  if (/buttered pasta/i.test(name)) return 25
  if (/fried rice/i.test(name)) return 20
  if (/stir fry/i.test(name)) return 15
  if (/roasted potatoes/i.test(name)) return 35
  if (/grilled cheese/i.test(name)) return 10
  return 20
}

function levelForRecipe(name: string) {
  if (/scrambled eggs|grilled cheese/i.test(name)) return 'Beginner'
  if (/fried rice|stir fry/i.test(name)) return 'Home Cook'
  return 'Beginner'
}

type SavedPageProps = {
  recipePrefs: RecipePrefs
  onToggleSaved: (recipeName: string) => void
  onSetFeedback: (recipeName: string, feedback: RecipeFeedback) => void
}

export default function SavedPage({
  recipePrefs,
  onToggleSaved,
  onSetFeedback,
}: SavedPageProps) {
  const [tab, setTab] = useState<AlbumTab>('all')

  const saved = useMemo(
    () => mockRecipes.filter((r) => recipePrefs[r.name]?.saved),
    [recipePrefs],
  )
  const liked = useMemo(
    () => mockRecipes.filter((r) => recipePrefs[r.name]?.feedback === 'like'),
    [recipePrefs],
  )
  const disliked = useMemo(
    () => mockRecipes.filter((r) => recipePrefs[r.name]?.feedback === 'dislike'),
    [recipePrefs],
  )

  const all = useMemo(() => {
    // "All Recipes" in the album means anything you've interacted with.
    return mockRecipes.filter((r) => {
      const pref = recipePrefs[r.name]
      return !!pref?.saved || pref?.feedback === 'like' || pref?.feedback === 'dislike'
    })
  }, [recipePrefs])

  const visible = tab === 'saved' ? saved : tab === 'liked' ? liked : tab === 'disliked' ? disliked : all

  const hasAny = all.length > 0

  return (
    <div className="min-h-dvh bg-[#fefae0] text-[#1d1c0d]">
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <div className="space-y-6">
          <header className="space-y-2">
            <h2 className="font-['Literata'] text-4xl font-semibold tracking-tight text-[#1d1c0d]">
              Recipe Album
            </h2>
            <p className="text-sm leading-6 text-[#554336]">
              Your curated collection of kitchen inspirations and daily flavors.
            </p>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            {([
              { id: 'all', label: 'All Recipes' },
              { id: 'saved', label: 'Saved' },
              { id: 'liked', label: 'Liked' },
              { id: 'disliked', label: 'Disliked' },
            ] as const).map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition',
                    active
                      ? 'bg-[#8d4b00] text-white'
                      : 'bg-[#f8f4db] text-[#554336] ring-1 ring-[#e7e3ca] hover:bg-[#f2efd5]',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {!hasAny ? (
            <div className="rounded-[1.5rem] bg-white/60 p-6 text-sm text-[#554336] shadow-sm ring-1 ring-white/60">
              Nothing here yet. Save recipes or leave a 👍/👎 from the pantry
              page to build your album.
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white/60 p-6 text-sm text-[#554336] shadow-sm ring-1 ring-white/60">
              No recipes in this tab yet.
            </div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {visible.map((r) => {
                const pref = recipePrefs[r.name] ?? {}
                const badge =
                  pref.saved
                    ? { text: '★ Saved', tone: 'bg-[#8d4b00] text-white' }
                    : pref.feedback === 'like'
                      ? { text: '👍 Liked', tone: 'bg-[#586330] text-white' }
                      : pref.feedback === 'dislike'
                        ? { text: '👎 Not for me', tone: 'bg-[#ba1a1a] text-white' }
                        : null

                const img = imageForRecipe(r.name)
                const mins = minutesForRecipe(r.name)
                const level = levelForRecipe(r.name)

                return (
                  <article
                    key={r.name}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm ring-1 ring-white/60"
                  >
                    <div className="relative h-44 bg-gradient-to-br from-[#ede9cf] to-[#f2efd5]">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                      {badge ? (
                        <div
                          className={[
                            'absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                            badge.tone,
                          ].join(' ')}
                        >
                          {badge.text}
                        </div>
                      ) : null}
                    </div>

                    <div className="p-4">
                      <h3 className="font-['Literata'] text-lg font-semibold leading-6 text-[#1d1c0d]">
                        {r.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#554336]">
                        {r.description ?? 'Saved for later.'}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-medium text-[#554336]">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <span aria-hidden="true">⏱</span> {mins}m
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1">
                          <span aria-hidden="true">👨‍🍳</span> {level}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSetFeedback(r.name, 'like')}
                          className={[
                            'rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                            'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                            pref.feedback === 'like'
                              ? 'border-[#586330]/40 bg-[#586330] text-white'
                              : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                          ].join(' ')}
                          aria-label={`Like ${r.name}`}
                        >
                          👍
                        </button>
                        <button
                          type="button"
                          onClick={() => onSetFeedback(r.name, 'dislike')}
                          className={[
                            'rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                            'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                            pref.feedback === 'dislike'
                              ? 'border-[#ba1a1a]/40 bg-[#ba1a1a] text-white'
                              : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                          ].join(' ')}
                          aria-label={`Dislike ${r.name}`}
                        >
                          👎
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSaved(r.name)}
                          className={[
                            'ml-auto rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                            'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                            pref.saved
                              ? 'border-[#8d4b00]/40 bg-[#8d4b00] text-white'
                              : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                          ].join(' ')}
                          aria-label={`${pref.saved ? 'Unsave' : 'Save'} ${r.name}`}
                        >
                          {pref.saved ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

