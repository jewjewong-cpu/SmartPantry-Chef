import { useEffect, useMemo, useState } from 'react'
import {
  ingredientIncludedByPantry,
  normalizeIngredient,
  type RecipeMatch,
} from '../utils/recipeMatch'
import type { RecipeFeedback, RecipePrefs } from '../App'
import pantryDesignScreen from '../assets/stitch/pantry-screen.png'
import scrambledEggsImg from '../assets/stitch/recipe-scrambled-eggs.png'
import avocadoToastEggsImg from '../assets/stitch/recipe-avocado-toast-eggs.png'
import simpleFriedRiceImg from '../assets/stitch/recipe-simple-fried-rice.png'
import butteredPastaImg from '../assets/stitch/recipe-buttered-pasta.png'
import garlicOliveOilPastaImg from '../assets/stitch/recipe-garlic-olive-oil-pasta.png'
import grilledCheeseImg from '../assets/stitch/recipe-grilled-cheese.png'
import stirFryImg from '../assets/stitch/recipe-one-pan-stir-fry.png'
import roastedPotatoesImg from '../assets/stitch/recipe-roasted-potatoes.png'
import { substitutionChoicesFor } from '../utils/substitutions'

type RecipeMatchesProps = {
  matches: readonly RecipeMatch[]
  /** Full pantry used for matching (typed + substitutes). */
  pantryIngredients: readonly string[]
  /** Only what the user typed — checklist UI resets when this changes. */
  manualPantryIngredients: readonly string[]
  onAddPantryIngredient: (ingredient: string) => void
  onViewRecipe?: (recipe: RecipeMatch['recipe']) => void
  recipePrefs: RecipePrefs
  onToggleSaved: (recipeName: string) => void
  onSetFeedback: (recipeName: string, feedback: RecipeFeedback) => void
}

function pantryHas(normalizedPantry: readonly string[], ingredient: string) {
  return ingredientIncludedByPantry(
    normalizedPantry,
    normalizeIngredient(ingredient),
  )
}

type IngredientDecision = 'unknown' | 'have' | 'dont_have'

function substitutionCoveredByPantry(
  normalizedPantry: readonly string[],
  recipeIngredient: string,
) {
  const choices = substitutionChoicesFor(recipeIngredient)
  return choices.some((c) => pantryHas(normalizedPantry, c.pantryItem))
}

function chosenSubstituteCoversPantry(args: {
  normalizedPantry: readonly string[]
  recipeIngredient: string
  chosenLabel: string | undefined
}) {
  const { normalizedPantry, recipeIngredient, chosenLabel } = args
  if (!chosenLabel) return false
  const choices = substitutionChoicesFor(recipeIngredient)
  const swap = choices.find((c) => c.label === chosenLabel)
  return !!swap && pantryHas(normalizedPantry, swap.pantryItem)
}

function statusFromMissing(missingCount: number) {
  if (missingCount <= 0) return '100% match'
  if (missingCount === 1) return 'Missing 1 ingredient'
  return `Missing ${missingCount} ingredients`
}

function minutesForRecipe(recipeName: string) {
  if (/scrambled eggs/i.test(recipeName)) return 10
  if (/avocado toast/i.test(recipeName)) return 15
  if (/garlic olive oil pasta/i.test(recipeName)) return 20
  if (/buttered pasta/i.test(recipeName)) return 15
  if (/fried rice/i.test(recipeName)) return 20
  if (/stir fry/i.test(recipeName)) return 15
  if (/roasted potatoes/i.test(recipeName)) return 35
  if (/grilled cheese/i.test(recipeName)) return 10
  return 20
}

function cropFromDesign(posX: string, posY: string) {
  return {
    backgroundImage: `url(${pantryDesignScreen})`,
    backgroundRepeat: 'no-repeat',
    // The screenshot is a single "sheet"; we crop by moving the background.
    backgroundSize: '100% auto',
    backgroundPosition: `${posX} ${posY}`,
  } as const
}

function imageStyleForRecipe(recipeName: string) {
  // Coordinates tuned to the Stitch screenshot layout.
  if (/scrambled eggs/i.test(recipeName))
    return {
      backgroundImage: `url(${scrambledEggsImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/avocado toast/i.test(recipeName))
    return {
      backgroundImage: `url(${avocadoToastEggsImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/garlic olive oil pasta/i.test(recipeName))
    return {
      backgroundImage: `url(${garlicOliveOilPastaImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/buttered pasta/i.test(recipeName))
    return {
      backgroundImage: `url(${butteredPastaImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/fried rice/i.test(recipeName))
    return {
      backgroundImage: `url(${simpleFriedRiceImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/stir fry/i.test(recipeName))
    return {
      backgroundImage: `url(${stirFryImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/roasted potatoes/i.test(recipeName))
    return {
      backgroundImage: `url(${roastedPotatoesImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  if (/grilled cheese/i.test(recipeName))
    return {
      backgroundImage: `url(${grilledCheeseImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const
  return undefined
}

export default function RecipeMatches({
  matches,
  pantryIngredients,
  manualPantryIngredients,
  onAddPantryIngredient,
  onViewRecipe,
  recipePrefs,
  onToggleSaved,
  onSetFeedback,
}: RecipeMatchesProps) {
  type DecisionTicketState = Record<string, Record<string, IngredientDecision>>
  type LabelTicketState = Record<string, Record<string, string>>

  const [decisions, setDecisions] = useState<DecisionTicketState>({})
  const [chosenSubstituteLabel, setChosenSubstituteLabel] =
    useState<LabelTicketState>({})

  const normalizedPantry = useMemo(() => {
    return pantryIngredients.map(normalizeIngredient).filter(Boolean)
  }, [pantryIngredients])

  const scoredMatches = useMemo(() => {
    // Re-score matches based on checklist ✓/× + chosen swaps.
    return matches.map((m) => {
      const recipeKey = m.recipe.name
      const core = (m.recipe.coreIngredients ?? []).map((x) => x.trim()).filter(Boolean)
      const recipeDecisions = decisions[recipeKey] ?? {}
      const recipeLabels = chosenSubstituteLabel[recipeKey] ?? {}

      const missingCoreIngredients = core.filter((ing) => {
        const inferredHave = pantryHas(normalizedPantry, ing)
        const decision = recipeDecisions[ing] ?? 'unknown'
        const chosenLabel = recipeLabels[ing]

        const anySwapCovers = substitutionCoveredByPantry(normalizedPantry, ing)
        const chosenSwapCovers = chosenSubstituteCoversPantry({
          normalizedPantry,
          recipeIngredient: ing,
          chosenLabel,
        })

        // ✓ means we treat it as present, regardless of pantry.
        if (decision === 'have') return false

        // × means missing, unless a swap is covering it (either chosen or already satisfied).
        if (decision === 'dont_have') {
          return !(anySwapCovers || chosenSwapCovers)
        }

        // Unknown: rely on pantry or swaps.
        return !(inferredHave || anySwapCovers || chosenSwapCovers)
      })

      const coreCount = core.length
      const missingCount = missingCoreIngredients.length
      const matchedCount = Math.max(0, coreCount - missingCount)
      const matchPercent =
        coreCount === 0 ? 0 : Math.round((matchedCount / coreCount) * 100)

      return {
        ...m,
        matchPercent,
        missingCount,
        missingCoreIngredients,
        statusLabel: statusFromMissing(missingCount),
      } satisfies RecipeMatch
    })
  }, [matches, decisions, chosenSubstituteLabel, normalizedPantry])

  const sortedMatches = useMemo(() => {
    const list = [...scoredMatches]
    list.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent
      return a.recipe.name.localeCompare(b.recipe.name)
    })
    return list
  }, [scoredMatches])

  const manualPantrySignature = useMemo(() => {
    return manualPantryIngredients
      .map(normalizeIngredient)
      .filter(Boolean)
      .join('|')
  }, [manualPantryIngredients])

  useEffect(() => {
    setDecisions({})
    setChosenSubstituteLabel({})
  }, [manualPantrySignature])

  const [selectedForChecklist, setSelectedForChecklist] = useState<string | null>(
    () => (sortedMatches[0]?.recipe.name ?? null),
  )

  useEffect(() => {
    if (sortedMatches.length === 0) {
      setSelectedForChecklist(null)
      return
    }
    setSelectedForChecklist((prev) => {
      if (!prev) return sortedMatches[0]?.recipe.name ?? null
      const stillExists = sortedMatches.some((m) => m.recipe.name === prev)
      return stillExists ? prev : (sortedMatches[0]?.recipe.name ?? null)
    })
  }, [sortedMatches])

  const selectedMatch = useMemo(() => {
    if (!selectedForChecklist) return null
    return sortedMatches.find((m) => m.recipe.name === selectedForChecklist) ?? null
  }, [selectedForChecklist, sortedMatches])

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-['Literata'] text-xl font-semibold text-[#1d1c0d]">
            Recipe Matches
          </h3>
          <p className="text-sm leading-6 text-[#554336]">
            Personalized suggestions based on your pantry.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
          aria-label="Filter matches"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 5h16" />
            <path d="M7 12h10" />
            <path d="M10 19h4" />
          </svg>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedMatches.map((m) => {
          const minutes = minutesForRecipe(m.recipe.name)
          const imgStyle = imageStyleForRecipe(m.recipe.name)
          const selected = selectedForChecklist === m.recipe.name
          const pref = recipePrefs[m.recipe.name]
          const liked = pref?.feedback === 'like'
          const disliked = pref?.feedback === 'dislike'
          const saved = !!pref?.saved
          return (
            <article
              key={m.recipe.name}
              className={[
                'overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm ring-1 ring-white/60 transition',
                selected ? 'ring-2 ring-[#8d4b00]/40' : 'hover:bg-white/80',
              ].join(' ')}
            >
              <div
                className={[
                  'relative h-36',
                  imgStyle ? '' : 'bg-gradient-to-br from-[#ede9cf] to-[#f2efd5]',
                ].join(' ')}
                style={imgStyle}
              >
                {/* Clickable image area. */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedForChecklist(m.recipe.name)
                    onViewRecipe?.(m.recipe)
                  }}
                  className="absolute inset-0"
                  aria-label={`Open ${m.recipe.name}`}
                />

                <div className="absolute left-3 top-3 rounded-full bg-[#8d4b00]/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                  {m.matchPercent}% Match
                </div>

                <div className="absolute inset-0 bg-black/0" />
              </div>

              <div className="p-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedForChecklist(m.recipe.name)
                    onViewRecipe?.(m.recipe)
                  }}
                  className="text-left"
                  aria-label={`Open ${m.recipe.name}`}
                >
                  <h4 className="font-['Literata'] text-lg font-semibold leading-6 text-[#1d1c0d]">
                    {m.recipe.name}
                  </h4>
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSetFeedback(m.recipe.name, 'like')}
                      className={[
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm transition',
                        'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                        liked
                          ? 'bg-[#586330] text-white ring-1 ring-[#586330]/40'
                          : 'bg-white/70 text-[#554336] ring-1 ring-white/60 hover:bg-white',
                      ].join(' ')}
                      aria-label={liked ? 'Unlike recipe' : 'Like recipe'}
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetFeedback(m.recipe.name, 'dislike')}
                      className={[
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm transition',
                        'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                        disliked
                          ? 'bg-[#ba1a1a] text-white ring-1 ring-[#ba1a1a]/40'
                          : 'bg-white/70 text-[#554336] ring-1 ring-white/60 hover:bg-white',
                      ].join(' ')}
                      aria-label={disliked ? 'Remove dislike' : 'Dislike recipe'}
                    >
                      👎
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSaved(m.recipe.name)}
                      className={[
                        'inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-sm shadow-sm ring-1 ring-white/60 transition',
                        'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                        saved ? 'text-[#8d4b00]' : 'text-[#554336] hover:bg-white',
                      ].join(' ')}
                      aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
                    >
                      {saved ? '★' : '☆'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-[#554336]">
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
                    <span>{minutes}m</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedForChecklist(m.recipe.name)}
                      className="rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
                    >
                      Ingredients
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Keep the ingredient checklist + substitutions visible (select a card to switch). */}
      {selectedMatch ? (
        <div className="rounded-[1.5rem] bg-white/70 p-5 shadow-sm ring-1 ring-white/60">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="font-['Literata'] text-lg font-semibold text-[#1d1c0d]">
                Ingredient checklist & swaps
              </p>
              <p className="text-sm text-[#554336]">
                For <span className="font-semibold">{selectedMatch.recipe.name}</span> — tap ✓/× and pick swaps if needed.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {(selectedMatch.recipe.coreIngredients ?? []).map((ing) => {
              const inferredHave = pantryHas(normalizedPantry, ing)
              const decision = decisions[selectedMatch.recipe.name]?.[ing] ?? 'unknown'
              const substitutionChoices = substitutionChoicesFor(ing)
              const chosenLabel = chosenSubstituteLabel[selectedMatch.recipe.name]?.[ing]

              const chosenSwap =
                chosenLabel != null
                  ? substitutionChoices.find((c) => c.label === chosenLabel)
                  : undefined
              const substitutePantryOk =
                !!chosenSwap && pantryHas(normalizedPantry, chosenSwap.pantryItem)
              const substitutePantryOkAnyChoice =
                substitutionChoices.some((c) => pantryHas(normalizedPantry, c.pantryItem))

              const uiTreatAsHave =
                decision === 'have' ||
                inferredHave ||
                substitutePantryOkAnyChoice ||
                substitutePantryOk

              const uiTreatAsDontHave =
                decision === 'dont_have' &&
                !substitutePantryOkAnyChoice &&
                !substitutePantryOk

              const showSubstitution =
                substitutionChoices.length > 0 &&
                (decision === 'dont_have' || chosenLabel != null)

              return (
                <div
                  key={ing}
                  className="rounded-[1.25rem] border border-[#e7e3ca] bg-[#f8f4db]/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-[#1d1c0d]">
                        {ing}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#554336]">
                        {substitutePantryOk || substitutePantryOkAnyChoice
                          ? `Covered by substitute (${chosenSwap?.pantryItem ?? 'your pantry'}).`
                          : uiTreatAsDontHave
                            ? 'Marked as: don’t have it.'
                            : decision === 'have'
                              ? 'Marked as: have it.'
                              : inferredHave
                                ? 'Looks like you already have it in your pantry.'
                                : 'Mark ✓ if you have it, or × if you don’t.'}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDecisions((prev) => {
                            const recipeKey = selectedMatch.recipe.name
                            const prevRecipe = prev[recipeKey] ?? {}
                            const current = prevRecipe[ing] ?? 'unknown'
                            let next: IngredientDecision
                            if (!inferredHave) {
                              if (current === 'dont_have') next = 'unknown'
                              else next = current === 'have' ? 'unknown' : 'have'
                            } else {
                              next = current === 'dont_have' ? 'unknown' : current
                            }

                            // If the user marks ✓ (or clears ×), we no longer rely on swaps.
                            setChosenSubstituteLabel((labelPrev) => {
                              const labelRecipe = labelPrev[recipeKey] ?? {}
                              if (!(ing in labelRecipe)) return labelPrev
                              const copy = { ...labelRecipe }
                              delete copy[ing]
                              return { ...labelPrev, [recipeKey]: copy }
                            })

                            return {
                              ...prev,
                              [recipeKey]: { ...prevRecipe, [ing]: next },
                            }
                          })
                        }}
                        className={[
                          'rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                          'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                          uiTreatAsHave && !uiTreatAsDontHave
                            ? 'border-[#8d4b00]/40 bg-[#8d4b00] text-white'
                            : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                        ].join(' ')}
                        aria-label={`Mark ${ing} as have`}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDecisions((prev) => {
                            const recipeKey = selectedMatch.recipe.name
                            const prevRecipe = prev[recipeKey] ?? {}
                            const next =
                              prevRecipe[ing] === 'dont_have' ? 'unknown' : 'dont_have'
                            if (next === 'unknown') {
                              setChosenSubstituteLabel((labelPrev) => {
                                const labelRecipe = labelPrev[recipeKey] ?? {}
                                if (!(ing in labelRecipe)) return labelPrev
                                const copy = { ...labelRecipe }
                                delete copy[ing]
                                return { ...labelPrev, [recipeKey]: copy }
                              })
                            }
                            return {
                              ...prev,
                              [recipeKey]: { ...prevRecipe, [ing]: next },
                            }
                          })
                        }}
                        className={[
                          'rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition',
                          'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                          uiTreatAsDontHave
                            ? 'border-[#8d4b00]/40 bg-[#8d4b00] text-white'
                            : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                        ].join(' ')}
                        aria-label={`Mark ${ing} as do not have`}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {showSubstitution ? (
                    <div className="mt-3 rounded-[1rem] border border-dashed border-[#dbc2b0] bg-white/60 p-3">
                      <p className="text-xs font-semibold text-[#554336]">
                        Swap ideas
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {substitutionChoices.map((c) => {
                          const alreadyInPantry = pantryHas(
                            normalizedPantry,
                            c.pantryItem,
                          )
                          const selected = chosenLabel === c.label
                          const coversNow =
                            decision === 'dont_have' &&
                            (substitutionCoveredByPantry(normalizedPantry, ing) ||
                              chosenSubstituteCoversPantry({
                                normalizedPantry,
                                recipeIngredient: ing,
                                chosenLabel,
                              }))

                          return (
                            <button
                              key={`${ing}::${c.label}`}
                              type="button"
                              onClick={() => {
                                const recipeKey = selectedMatch.recipe.name
                                setChosenSubstituteLabel((prev) => {
                                  const prevRecipe = prev[recipeKey] ?? {}
                                  return {
                                    ...prev,
                                    [recipeKey]: {
                                      ...prevRecipe,
                                      [ing]: c.label,
                                    },
                                  }
                                })

                                // If the user picks a swap and it's not already in the pantry,
                                // add it to pantry tags to keep matching intuitive.
                                if (!alreadyInPantry) onAddPantryIngredient(c.pantryItem)
                              }}
                              className={[
                                'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition',
                                'focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20',
                                selected
                                  ? 'border-[#8d4b00]/40 bg-[#8d4b00] text-white'
                                  : 'border-[#e7e3ca] bg-white/70 text-[#554336] hover:bg-white',
                                alreadyInPantry ? 'opacity-70' : '',
                                coversNow ? 'ring-2 ring-[#586330]/25' : '',
                              ].join(' ')}
                            >
                              {c.label}
                              {alreadyInPantry ? ' (already in pantry)' : ''}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

