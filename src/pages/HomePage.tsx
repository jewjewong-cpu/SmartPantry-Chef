import PantryInput from '../components/PantryInput'
import RecipeMatches from '../components/RecipeMatches'
import RecipeDetail, { type SkillLevel } from '../components/RecipeDetail'
import CookingMode from '../components/CookingMode'
import RecipeDebugger from '../components/RecipeDebugger'
import { mockRecipes } from '../data/mockRecipes'
import { comparePantryToRecipes, normalizeIngredient } from '../utils/recipeMatch'
import { useEffect, useMemo, useState } from 'react'
import type { RecipeFeedback, RecipePrefs } from '../App'

type HomePageProps = {
  manualIngredients: string[]
  onManualIngredientsChange: (next: string[]) => void
  substituteIngredients: string[]
  onAddSubstituteIngredient: (ingredient: string) => void
  onClearSubstitutes: () => void
  recipePrefs: RecipePrefs
  onToggleSaved: (recipeName: string) => void
  onSetFeedback: (recipeName: string, feedback: RecipeFeedback) => void
}

export default function HomePage({
  manualIngredients,
  onManualIngredientsChange,
  substituteIngredients,
  onAddSubstituteIngredient,
  onClearSubstitutes,
  recipePrefs,
  onToggleSaved,
  onSetFeedback,
}: HomePageProps) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Beginner')
  const [selectedRecipeName, setSelectedRecipeName] = useState<string | null>(
    null,
  )
  const [stepsOpen, setStepsOpen] = useState(false)
  const [debuggerOpen, setDebuggerOpen] = useState(false)
  const [debuggerContext, setDebuggerContext] = useState<{
    recipeName?: string
    skillLevel?: string
    stepNumber?: number
    stepCount?: number
    stepText?: string
  }>({})
  const [checkedStepsByKey, setCheckedStepsByKey] = useState<
    Record<string, boolean[]>
  >(() => {
    try {
      const raw = window.localStorage.getItem('spc_checked_steps_v1')
      if (!raw) return {}
      const parsed = JSON.parse(raw) as Record<string, unknown>
      const next: Record<string, boolean[]> = {}
      for (const [k, v] of Object.entries(parsed)) {
        if (!Array.isArray(v)) continue
        next[k] = v.map((x) => Boolean(x))
      }
      return next
    } catch {
      return {}
    }
  })

  const effectivePantry = useMemo(() => {
    return [...manualIngredients, ...substituteIngredients]
  }, [manualIngredients, substituteIngredients])

  const hasIngredients = manualIngredients.length > 0

  useEffect(() => {
    if (manualIngredients.length > 0) return
    onClearSubstitutes()
  }, [manualIngredients.length, onClearSubstitutes])

  const matches = useMemo(() => {
    return comparePantryToRecipes(effectivePantry, mockRecipes)
  }, [effectivePantry])

  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeName) return null
    return mockRecipes.find((r) => r.name === selectedRecipeName) ?? null
  }, [selectedRecipeName])

  const selectedSteps = useMemo(() => {
    if (!selectedRecipe) return []
    const table = selectedRecipe.instructions ?? {}
    return table[skillLevel] ?? table.Beginner ?? []
  }, [selectedRecipe, skillLevel])

  const selectedStepKey = useMemo(() => {
    if (!selectedRecipe) return null
    return `${selectedRecipe.name}__${skillLevel}`
  }, [selectedRecipe, skillLevel])

  const checkedSteps = useMemo(() => {
    if (!selectedStepKey) return []
    const existing = checkedStepsByKey[selectedStepKey] ?? []
    if (existing.length === selectedSteps.length) return existing
    const next = Array.from({ length: selectedSteps.length }, (_, idx) =>
      existing[idx] ?? false,
    )
    return next
  }, [checkedStepsByKey, selectedStepKey, selectedSteps.length])

  useEffect(() => {
    // Keep the per-recipe array length in sync with the current step list.
    if (!selectedStepKey) return
    setCheckedStepsByKey((prev) => {
      const existing = prev[selectedStepKey] ?? []
      if (existing.length === selectedSteps.length) return prev
      const next = Array.from({ length: selectedSteps.length }, (_, idx) =>
        existing[idx] ?? false,
      )
      return { ...prev, [selectedStepKey]: next }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStepKey, selectedSteps.length])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'spc_checked_steps_v1',
        JSON.stringify(checkedStepsByKey),
      )
    } catch {
      // ignore
    }
  }, [checkedStepsByKey])

  function toggleCheckedStep(stepIndex: number) {
    if (!selectedStepKey) return
    setCheckedStepsByKey((prev) => {
      const existing = prev[selectedStepKey] ?? []
      const next = Array.from({ length: selectedSteps.length }, (_, idx) =>
        existing[idx] ?? false,
      )
      next[stepIndex] = !next[stepIndex]
      return { ...prev, [selectedStepKey]: next }
    })
  }

  function resetCheckedSteps() {
    if (!selectedStepKey) return
    setCheckedStepsByKey((prev) => ({
      ...prev,
      [selectedStepKey]: Array.from({ length: selectedSteps.length }, () => false),
    }))
  }

  function currentStepContext() {
    if (selectedSteps.length === 0) return {}
    const idx = checkedSteps.findIndex((x) => !x)
    const currentIdx = idx >= 0 ? idx : Math.max(0, selectedSteps.length - 1)
    return {
      stepNumber: currentIdx + 1,
      stepCount: selectedSteps.length,
      stepText: selectedSteps[currentIdx],
    }
  }

  useEffect(() => {
    if (!selectedRecipeName) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [selectedRecipeName])

  useEffect(() => {
    if (!stepsOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [stepsOpen])

  function normalizePantryValue(value: string) {
    return value.trim().replace(/\s+/g, ' ')
  }

  function addSubstituteIngredient(ingredient: string) {
    const next = normalizePantryValue(ingredient)
    if (!next) return

    // Avoid duplicates across manual+substitutes.
    const merged = [...manualIngredients, ...substituteIngredients]
    const existing = new Set(merged.map((x) => normalizeIngredient(x)))
    const key = normalizeIngredient(next)
    if (existing.has(key)) return

    onAddSubstituteIngredient(next)
  }

  return (
    <div className="min-h-dvh bg-[#fefae0] text-[#1d1c0d]">
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-start justify-center px-6 py-10">
        <div
          className="w-full rounded-2xl border border-white/60 bg-white/70 p-8 shadow-sm"
        >
          <div className="max-w-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="font-['Literata'] text-2xl font-semibold tracking-tight text-[#8d4b00]">
                My Kitchen
              </h2>
              <p className="text-sm leading-6 text-[#554336]">
                Add what&apos;s in your pantry to see personalized recipe matches.
              </p>
            </div>

            <PantryInput
              ingredients={manualIngredients}
              onIngredientsChange={onManualIngredientsChange}
            />

            {substituteIngredients.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#554336]">
                  Added from substitutions
                </p>
                <ul className="flex flex-wrap gap-2">
                  {substituteIngredients.map((ingredient) => (
                    <li key={ingredient}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#e7e3ca] bg-[#f8f4db] px-3 py-1.5 text-sm text-[#554336]">
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasIngredients ? (
              <div className="border-t border-[#e7e3ca] pt-6">
                <RecipeMatches
                  matches={matches}
                  pantryIngredients={effectivePantry}
                  manualPantryIngredients={manualIngredients}
                  onAddPantryIngredient={addSubstituteIngredient}
                  onViewRecipe={(recipe) => setSelectedRecipeName(recipe.name)}
                  recipePrefs={recipePrefs}
                  onToggleSaved={onToggleSaved}
                  onSetFeedback={onSetFeedback}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-[#e7e3ca] bg-[#f8f4db] p-4 text-sm leading-6 text-[#554336]">
                Add at least one ingredient to see recipe matches based on your pantry.
              </div>
            )}
          </div>
        </div>
      </main>

      {hasIngredients && selectedRecipe ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Recipe: ${selectedRecipe.name}`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm"
            onClick={() => {
              setSelectedRecipeName(null)
              setStepsOpen(false)
            }}
            aria-label="Close recipe"
          />

          <div className="relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[#e7e3ca] bg-[#fefae0] shadow-xl">
            <div className="max-h-[85vh] overflow-auto p-4 sm:p-6">
              <RecipeDetail
                recipe={selectedRecipe}
                level={skillLevel}
                onLevelChange={setSkillLevel}
                onClose={() => {
                  setSelectedRecipeName(null)
                  setStepsOpen(false)
                }}
                checkedSteps={checkedSteps}
                onToggleStep={toggleCheckedStep}
                onResetSteps={resetCheckedSteps}
                onSomethingWentWrong={() => {
                  setDebuggerContext({
                    recipeName: selectedRecipe.name,
                    skillLevel,
                    ...currentStepContext(),
                  })
                  setDebuggerOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {hasIngredients && selectedRecipe && stepsOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Steps: ${selectedRecipe.name}`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setStepsOpen(false)}
            aria-label="Close steps"
          />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-zinc-900">
                  {selectedRecipe.name}
                </p>
                <p className="text-sm text-zinc-600">Steps</p>
              </div>
              <button
                type="button"
                onClick={() => setStepsOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200/60"
              >
                Back to recipe
              </button>
            </div>

            <div className="max-h-[80vh] overflow-auto p-4 sm:p-5">
              <CookingMode
                steps={selectedSteps}
                onSomethingWentWrong={({ stepIndex, stepText }) => {
                  setDebuggerContext({
                    recipeName: selectedRecipe?.name,
                    skillLevel,
                    stepNumber:
                      selectedSteps.length === 0 ? 0 : stepIndex + 1,
                    stepCount: selectedSteps.length,
                    stepText,
                  })
                  setDebuggerOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      <RecipeDebugger
        open={debuggerOpen}
        onClose={() => setDebuggerOpen(false)}
        context={debuggerContext}
      />
    </div>
  )
}

