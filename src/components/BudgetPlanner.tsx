import { useEffect, useMemo, useState } from 'react'
import { normalizeIngredient } from '../utils/recipeMatch'
import { formatUsd, priceForIngredient } from '../utils/pricing'
import scrambledEggsImg from '../assets/stitch/recipe-scrambled-eggs.png'
import avocadoToastImg from '../assets/stitch/recipe-avocado-toast-eggs.png'
import garlicOliveOilPastaImg from '../assets/stitch/recipe-garlic-olive-oil-pasta.png'
import butteredPastaImg from '../assets/stitch/recipe-buttered-pasta.png'
import simpleFriedRiceImg from '../assets/stitch/recipe-simple-fried-rice.png'
import stirFryImg from '../assets/stitch/recipe-one-pan-stir-fry.png'
import roastedPotatoesImg from '../assets/stitch/recipe-roasted-potatoes.png'
import grilledCheeseImg from '../assets/stitch/recipe-grilled-cheese.png'

type RecipeLike = {
  name: string
  coreIngredients: readonly string[]
  optionalIngredients?: readonly string[]
}

type BudgetPlannerProps = {
  budget: number
  onBudgetChange: (value: number) => void
  pantryIngredients: readonly string[]
  recipes: readonly RecipeLike[]
}

function uniqueNormalized(list: readonly string[]) {
  const out: string[] = []
  const seen = new Set<string>()
  for (const item of list) {
    const n = normalizeIngredient(item)
    if (!n || seen.has(n)) continue
    seen.add(n)
    out.push(item.trim())
  }
  return out
}

export default function BudgetPlanner({
  budget,
  onBudgetChange,
  pantryIngredients,
  recipes,
}: BudgetPlannerProps) {
  const [draftBudget, setDraftBudget] = useState<string>('')
  const [draftMealsPerWeek, setDraftMealsPerWeek] = useState<string>('3')

  const [appliedMealsPerWeek, setAppliedMealsPerWeek] = useState<number>(3)
  const [purchasedByIngredient, setPurchasedByIngredient] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const raw = window.localStorage.getItem('budgetPlanner:purchasedByIngredient')
      if (!raw) return {}
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return {}
      return parsed as Record<string, boolean>
    } catch {
      return {}
    }
  })

  useEffect(() => {
    setDraftBudget(Number.isFinite(budget) && budget > 0 ? String(budget) : '')
  }, [budget])

  function applySettings() {
    const parsedBudget = draftBudget.trim() === '' ? 0 : Number(draftBudget)
    const nextBudget = Number.isFinite(parsedBudget) ? Math.max(0, parsedBudget) : 0
    onBudgetChange(nextBudget)

    const parsedMeals = draftMealsPerWeek.trim() === '' ? 0 : Number(draftMealsPerWeek)
    const nextMeals = Number.isFinite(parsedMeals) ? Math.max(0, Math.min(21, parsedMeals)) : 0
    setAppliedMealsPerWeek(nextMeals)
  }

  const ready = budget > 0 && appliedMealsPerWeek > 0

  const plan = useMemo(() => {
    const pantrySet = new Set(pantryIngredients.map(normalizeIngredient))

    const scored = recipes.map((r) => {
      const missingCore = r.coreIngredients.filter(
        (i) => !pantrySet.has(normalizeIngredient(i)),
      )
      const estimatedCost = uniqueNormalized(missingCore).reduce(
        (sum, ing) => sum + priceForIngredient(ing),
        0,
      )
      return { recipe: r, missingCore, estimatedCost }
    })

    // Prefer cheaper recipes first for the demo plan.
    scored.sort((a, b) => a.estimatedCost - b.estimatedCost)

    const selected = scored.slice(0, Math.max(1, appliedMealsPerWeek))
    const shoppingList = uniqueNormalized(
      selected.flatMap((x) => x.missingCore),
    ).map((ing) => ({ ingredient: ing, price: priceForIngredient(ing) }))

    const total = shoppingList.reduce((sum, x) => sum + x.price, 0)

    return { selected, shoppingList, total }
  }, [pantryIngredients, recipes, appliedMealsPerWeek])

  const overBudget = ready && plan.total > budget

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'budgetPlanner:purchasedByIngredient',
        JSON.stringify(purchasedByIngredient),
      )
    } catch {
      // Ignore storage issues (private mode, quota, etc.)
    }
  }, [purchasedByIngredient])

  useEffect(() => {
    // Drop purchased flags for ingredients no longer in the current list.
    const keep = new Set(plan.shoppingList.map((x) => normalizeIngredient(x.ingredient)))
    setPurchasedByIngredient((prev) => {
      const next: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (keep.has(k)) next[k] = v
      }
      return next
    })
  }, [plan.shoppingList])

  const selectedCount = ready ? plan.selected.length : 0

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

  return (
    <section className="space-y-8">
      {/* Budget settings */}
      <div className="rounded-[1.5rem] bg-white/40 p-6 shadow-sm ring-1 ring-white/60">
        <div className="flex items-center gap-2 text-[#586330]">
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
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M7 12h10" />
            <path d="M7 9h.01" />
            <path d="M17 15h.01" />
          </svg>
          <h3 className="font-['Literata'] text-lg font-semibold">
            Budget Settings
          </h3>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-wide text-[#554336]">
              Weekly Budget (USD)
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-[#dbc2b0] bg-white/70 px-4 py-3 shadow-sm focus-within:ring-4 focus-within:ring-[#8d4b00]/15">
              <span className="text-sm font-semibold text-[#554336]">$</span>
              <input
                value={draftBudget}
                onChange={(e) => setDraftBudget(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                className="w-full bg-transparent text-sm text-[#1d1c0d] outline-none"
                aria-label="Weekly budget"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-wide text-[#554336]">
              Meals per Week
            </span>
            <div className="rounded-xl border border-[#dbc2b0] bg-white/70 px-4 py-3 shadow-sm focus-within:ring-4 focus-within:ring-[#8d4b00]/15">
              <input
                value={draftMealsPerWeek}
                onChange={(e) => setDraftMealsPerWeek(e.target.value)}
                inputMode="numeric"
                placeholder="3"
                className="w-full bg-transparent text-sm text-[#1d1c0d] outline-none"
                aria-label="Meals per week"
              />
            </div>
          </label>

          <button
            type="button"
            onClick={applySettings}
            className="h-[46px] w-full rounded-xl bg-[#8d4b00] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a4500] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
          >
            Update Planner
          </button>
        </div>
      </div>

      {/* Plan + shopping list */}
      {ready ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-['Literata'] text-2xl font-semibold text-[#1d1c0d]">
                Your Meal Plan
              </h3>
              <span className="rounded-full bg-[#f8f4db] px-3 py-1 text-xs font-semibold text-[#8d4b00] ring-1 ring-[#e7e3ca]">
                {selectedCount} Recipes Selected
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {plan.selected.map((x) => {
                const img = imageForRecipe(x.recipe.name)
                return (
                  <article
                    key={x.recipe.name}
                    className="flex gap-4 rounded-[1.25rem] bg-white/70 p-4 shadow-sm ring-1 ring-white/60"
                  >
                    <div className="h-20 w-24 overflow-hidden rounded-xl bg-[#ede9cf] ring-1 ring-white/60">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-['Literata'] text-lg font-semibold text-[#1d1c0d]">
                            {x.recipe.name}
                          </p>
                          <p className="mt-0.5 text-xs text-[#554336]">
                            {/* demo subtitle */}
                            {x.recipe.name.includes('Scrambled')
                              ? 'High Protein • 10 mins prep'
                              : x.recipe.name.includes('Avocado')
                                ? 'Healthy Fats • 5 mins prep'
                                : 'Weekly pick • 15 mins prep'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#8d4b00] hover:text-[#6e3900]"
                          aria-label={`Details for ${x.recipe.name}`}
                        >
                          ↗ Details
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <p className="text-xs text-[#586330]">
                          Est. Cost:{' '}
                          <span className="font-semibold text-[#1d1c0d]">
                            {formatUsd(x.estimatedCost)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="rounded-[1.25rem] bg-[#ede9cf]/70 p-5 shadow-sm ring-1 ring-white/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-['Literata'] text-2xl font-semibold text-[#1d1c0d]">
                  Shopping List
                </h3>
                <p className="text-sm text-[#554336]">Items to purchase</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold tracking-wide text-[#554336]">
                  TOTAL COST
                </p>
                <p className="font-['Literata'] text-3xl font-semibold text-[#8d4b00]">
                  {formatUsd(plan.total)}
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {plan.shoppingList.map((x) => {
                const key = normalizeIngredient(x.ingredient)
                const checked = purchasedByIngredient[key] ?? false
                return (
                  <li key={key} className="flex items-center justify-between gap-3">
                    <label className="flex min-w-0 flex-1 items-center gap-3">
                      <span
                        className={[
                          'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                          checked
                            ? 'border-[#586330] bg-[#586330] text-white'
                            : 'border-[#586330] bg-transparent',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPurchasedByIngredient((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }}
                          className="sr-only"
                          aria-label={`Mark ${x.ingredient} as purchased`}
                        />
                        {checked ? '✓' : null}
                      </span>
                      <span
                        className={[
                          'min-w-0 truncate text-sm text-[#1d1c0d]',
                          checked ? 'opacity-60 line-through' : '',
                        ].join(' ')}
                      >
                        {x.ingredient}
                      </span>
                    </label>
                    <span className="text-sm text-[#554336]">
                      {formatUsd(x.price)}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                className="w-full rounded-xl bg-white/60 px-4 py-3 text-sm font-semibold text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
              >
                🖨 Print List
              </button>
            </div>

            {overBudget ? (
              <p className="mt-4 text-xs text-[#ba1a1a]">
                This plan is over budget. Try reducing meals/week or increasing your budget.
              </p>
            ) : null}
          </aside>
        </div>
      ) : (
        <div className="rounded-[1.25rem] bg-white/60 p-5 text-sm text-[#554336] shadow-sm ring-1 ring-white/60">
          Enter your <span className="font-semibold">weekly budget</span> and{' '}
          <span className="font-semibold">meals per week</span>, then click{' '}
          <span className="font-semibold">Update Planner</span>.
        </div>
      )}
    </section>
  )
}

