import { useMemo, useState } from 'react'
import scrambledEggsImg from '../assets/stitch/recipe-scrambled-eggs.png'
import avocadoToastImg from '../assets/stitch/recipe-avocado-toast-eggs.png'
import garlicOliveOilPastaImg from '../assets/stitch/recipe-garlic-olive-oil-pasta.png'
import butteredPastaImg from '../assets/stitch/recipe-buttered-pasta.png'
import simpleFriedRiceImg from '../assets/stitch/recipe-simple-fried-rice.png'
import stirFryImg from '../assets/stitch/recipe-one-pan-stir-fry.png'
import roastedPotatoesImg from '../assets/stitch/recipe-roasted-potatoes.png'
import grilledCheeseImg from '../assets/stitch/recipe-grilled-cheese.png'

export type SkillLevel = 'Beginner' | 'Home Cook' | 'Pro'

type RecipeDetailRecipe = {
  name: string
  description?: string
  coreIngredients?: readonly string[]
  optionalIngredients?: readonly string[]
  instructions?: Partial<Record<SkillLevel, readonly string[]>>
}

type RecipeDetailProps = {
  recipe: RecipeDetailRecipe
  level: SkillLevel
  onLevelChange: (level: SkillLevel) => void
  onClose?: () => void
  onSomethingWentWrong?: () => void
  checkedSteps?: readonly boolean[]
  onToggleStep?: (stepIndex: number) => void
  onResetSteps?: () => void
}

const LEVELS: SkillLevel[] = ['Beginner', 'Home Cook', 'Pro']

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

function prepTimeForRecipe(name: string) {
  if (/scrambled eggs/i.test(name)) return 5
  if (/avocado toast/i.test(name)) return 5
  if (/garlic olive oil pasta/i.test(name)) return 15
  if (/buttered pasta/i.test(name)) return 15
  if (/fried rice/i.test(name)) return 20
  if (/stir fry/i.test(name)) return 15
  if (/roasted potatoes/i.test(name)) return 10
  if (/grilled cheese/i.test(name)) return 10
  return 10
}

function chefTipForRecipe(name: string) {
  if (/scrambled eggs/i.test(name))
    return 'Always use the coldest butter and the lowest heat. Patience is the primary ingredient for eggs that melt in your mouth like silk.'
  if (/garlic olive oil pasta/i.test(name))
    return 'Keep the garlic pale-gold, not brown. Add a splash of starchy water to make the sauce cling.'
  if (/fried rice/i.test(name))
    return 'Cold rice browns better. Spread it out and let it crisp before you toss.'
  if (/stir fry/i.test(name))
    return 'Crowding causes steaming. Cook in batches so the pan stays hot and the veggies stay crisp.'
  return 'Taste early, adjust gently, and keep the heat a little lower than you think.'
}

export default function RecipeDetail({
  recipe,
  level,
  onLevelChange,
  onClose,
  onSomethingWentWrong,
  checkedSteps,
  onToggleStep,
  onResetSteps,
}: RecipeDetailProps) {
  const [checklistOpen, setChecklistOpen] = useState(false)
  const steps = useMemo(() => {
    const table = recipe.instructions ?? {}
    return table[level] ?? table.Beginner ?? []
  }, [level, recipe.instructions])

  const ingredients = useMemo(() => {
    const core = recipe.coreIngredients ?? []
    const optional = recipe.optionalIngredients ?? []
    return [...core, ...optional].filter(Boolean)
  }, [recipe.coreIngredients, recipe.optionalIngredients])

  const img = imageForRecipe(recipe.name)
  const prepMins = prepTimeForRecipe(recipe.name)
  const stepChecks = checkedSteps ?? []
  const checkedCount = stepChecks.filter(Boolean).length
  const stepCount = steps.length

  return (
    <section className="grid gap-6 lg:grid-cols-12">
      {/* Left parchment */}
      <div
        className="relative overflow-hidden rounded-[1.5rem] border border-[#e7e3ca] bg-[#f8f4db]/70 p-6 shadow-sm lg:col-span-7"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(29,28,13,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,28,13,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest text-[#887364]">
              FROM THE KITCHEN OF
            </p>
            <h3 className="mt-2 font-['Literata'] text-3xl font-semibold leading-tight tracking-tight text-[#8d4b00]">
              {recipe.name}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const selected = l === level
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onLevelChange(l)}
                    className={[
                      'rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition',
                      selected
                        ? 'bg-[#8d4b00] text-white'
                        : 'bg-white/60 text-[#554336] ring-1 ring-white/60 hover:bg-white',
                    ].join(' ')}
                    aria-pressed={selected}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
              aria-label="Close recipe"
            >
              ×
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#586330]">
              <span aria-hidden="true">⌂</span>
              <p className="font-['Literata'] text-lg font-semibold">
                Ingredients
              </p>
            </div>
            <ul className="space-y-3 text-sm text-[#554336]">
              {ingredients.slice(0, 8).map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#887364] bg-white/40" />
                  <span>{i}</span>
                </li>
              ))}
              {ingredients.length === 0 ? (
                <li className="text-sm text-[#554336]">
                  No ingredients listed.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#586330]">
                <span aria-hidden="true">🍴</span>
                <p className="font-['Literata'] text-lg font-semibold">
                  Preparation
                </p>
              </div>
            </div>

            {steps.length > 0 ? (
              <ol className="space-y-4 text-sm leading-6 text-[#554336]">
                {steps.slice(0, 6).map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-['Literata'] text-base font-semibold text-[#8d4b00]">
                      {idx + 1}.
                    </span>
                    <span className="italic">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[#554336]">
                No instructions yet for this level.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#e7e3ca] pt-4">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-[#887364]">
              PREP TIME
            </p>
            <p className="mt-1 font-['Literata'] text-lg font-semibold text-[#8d4b00]">
              {prepMins} mins
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-[#887364]">
              YIELDS
            </p>
            <p className="mt-1 font-['Literata'] text-lg font-semibold text-[#8d4b00]">
              2 Servings
            </p>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4 lg:col-span-5">
        <div className="overflow-hidden rounded-[1.5rem] border border-[#e7e3ca] bg-white/60 shadow-sm">
          <div className="h-48 bg-gradient-to-br from-[#ede9cf] to-[#f2efd5]">
            {img ? (
              <img src={img} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#e7e3ca] bg-[#f8f4db]/70 p-5 shadow-sm">
          <p className="font-['Literata'] text-xl font-semibold text-[#8d4b00]">
            Chef&apos;s Secret Tip
          </p>
          <p className="mt-2 text-sm leading-6 text-[#554336]">
            “{chefTipForRecipe(recipe.name)}”
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Vegetarian', 'Quick Meal'].map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#d8e6a6] px-3 py-1 text-xs font-semibold text-[#404b1b]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#e7e3ca] bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#554336]">
              Cooking Progress
            </p>
            <p className="text-sm font-semibold text-[#8d4b00]">
              Ready to Plate
            </p>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#ede9cf]">
            <div className="h-3 w-[92%] rounded-full bg-[#8d4b00]" />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setChecklistOpen((v) => !v)}
              className="w-full rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
            >
              {checklistOpen ? 'Hide step checklist' : 'Check off steps'}
              {stepCount > 0 ? ` (${checkedCount}/${stepCount})` : ''}
            </button>

            {checklistOpen ? (
              <div className="mt-3 rounded-[1rem] bg-white/60 p-3 ring-1 ring-white/60">
                {stepCount > 0 ? (
                  <ul className="space-y-2">
                    {steps.map((s, idx) => {
                      const checked = stepChecks[idx] ?? false
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleStep?.(idx)}
                            className={[
                              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                              checked
                                ? 'border-[#586330] bg-[#586330] text-white'
                                : 'border-[#887364] bg-transparent text-transparent',
                            ].join(' ')}
                            aria-label={
                              checked
                                ? `Uncheck step ${idx + 1}`
                                : `Check step ${idx + 1}`
                            }
                          >
                            ✓
                          </button>
                          <span
                            className={[
                              'text-sm leading-6 text-[#554336]',
                              checked ? 'opacity-70 line-through' : '',
                            ].join(' ')}
                          >
                            {s}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm leading-6 text-[#554336]">
                    No steps found for this recipe/level yet.
                  </p>
                )}

                {stepCount > 0 ? (
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onResetSteps?.()}
                      className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#554336] shadow-sm ring-1 ring-white/60 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
                    >
                      Reset checks
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onSomethingWentWrong}
          className="w-full rounded-[1.25rem] bg-[#8d4b00] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7a4500] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
        >
          Something went wrong
        </button>
      </div>
    </section>
  )
}

