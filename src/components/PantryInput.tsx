import { useEffect, useId, useMemo, useRef, useState } from 'react'

type PantryInputProps = {
  ingredients?: string[]
  onIngredientsChange?: (ingredients: string[]) => void
  initialIngredients?: string[]
}

function normalizeIngredient(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export default function PantryInput({
  ingredients: controlledIngredients,
  onIngredientsChange,
  initialIngredients,
}: PantryInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState('')
  const [uncontrolledIngredients, setUncontrolledIngredients] = useState<
    string[]
  >(initialIngredients?.map(normalizeIngredient).filter(Boolean) ?? [])

  const ingredients = controlledIngredients ?? uncontrolledIngredients
  const setIngredients = onIngredientsChange ?? setUncontrolledIngredients

  useEffect(() => {
    if (controlledIngredients) return
    onIngredientsChange?.(uncontrolledIngredients)
  }, [controlledIngredients, onIngredientsChange, uncontrolledIngredients])

  const normalizedSet = useMemo(() => {
    return new Set(ingredients.map((x) => x.toLocaleLowerCase()))
  }, [ingredients])

  function addCurrentValue() {
    const next = normalizeIngredient(value)
    if (!next) return
    if (normalizedSet.has(next.toLocaleLowerCase())) {
      setValue('')
      return
    }

    setIngredients([...ingredients, next])
    setValue('')
  }

  function removeIngredient(ingredient: string) {
    setIngredients(ingredients.filter((x) => x !== ingredient))
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-['Literata'] text-xl font-semibold tracking-tight text-[#8d4b00]">
          What&apos;s in your kitchen?
        </h2>
        <p className="text-sm leading-6 text-[#554336]">
          Add the ingredients you have on hand. Press Enter to add.
        </p>
      </div>

      <div className="rounded-[1.5rem] bg-white/60 p-5 shadow-sm ring-1 ring-white/60">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id={inputId}
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              e.preventDefault()
              addCurrentValue()
            }}
            placeholder="Add more ingredients..."
            className="w-full rounded-full border border-[#d8cbb2] bg-white/70 py-3 pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-[#8d4b00] focus:ring-4 focus:ring-[#8d4b00]/20"
          />
        </div>

        {ingredients.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-2 rounded-full bg-[#d8e6a6]/70 px-3 py-1.5 text-sm font-medium text-[#5c6834] ring-1 ring-[#dbe9a9]/70"
              >
                <span className="max-w-[12rem] truncate">{ingredient}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient)}
                  className="rounded-full p-0.5 text-[#586330] transition hover:bg-[#dbe9a9]/90 focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
                  aria-label={`Remove ${ingredient}`}
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center gap-2 rounded-full bg-[#f8f4db]/70 px-3 py-1.5 text-sm font-semibold text-[#8f4a00] ring-1 ring-[#e7e3ca] transition hover:bg-[#fefae0]"
              aria-label="More ingredients"
            >
              <span aria-hidden="true">+</span> More
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center gap-2 rounded-full bg-[#f8f4db]/70 px-3 py-1.5 text-sm font-semibold text-[#8f4a00] ring-1 ring-[#e7e3ca] transition hover:bg-[#fefae0]"
              aria-label="Add first ingredient"
            >
              <span aria-hidden="true">+</span> Add your first ingredient
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

