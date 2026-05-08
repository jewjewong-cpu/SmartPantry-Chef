import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BudgetPage from './pages/BudgetPage'
import SavedPage from './pages/SavedPage'
import OpeningPage from './pages/OpeningPage'
import logoImg from './assets/stitch/smartpantry-logo-circle.png'
import { normalizeIngredient } from './utils/recipeMatch'
import { useEffect, useMemo, useState } from 'react'

export type RecipeFeedback = 'neutral' | 'like' | 'dislike'
export type RecipePrefs = Record<
  string,
  { saved?: boolean; feedback?: RecipeFeedback }
>

export default function App() {
  /** Ingredients typed in Pantry Input */
  const [manualIngredients, setManualIngredients] = useState<string[]>([])
  /** Ingredients added via substitution picks (does not reset checklist state) */
  const [substituteIngredients, setSubstituteIngredients] = useState<string[]>(
    [],
  )
  const [recipePrefs, setRecipePrefs] = useState<RecipePrefs>(() => {
    try {
      const raw = localStorage.getItem('spc_recipe_prefs')
      if (!raw) return {}
      return JSON.parse(raw) as RecipePrefs
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('spc_recipe_prefs', JSON.stringify(recipePrefs))
    } catch {
      // ignore demo storage failures
    }
  }, [recipePrefs])

  const effectivePantry = useMemo(
    () => [...manualIngredients, ...substituteIngredients],
    [manualIngredients, substituteIngredients],
  )

  function addSubstituteIngredient(ingredient: string) {
    setSubstituteIngredients((prev) => {
      const merged = [...manualIngredients, ...prev]
      const existing = new Set(merged.map((x) => normalizeIngredient(x)))
      const key = normalizeIngredient(ingredient)
      if (existing.has(key)) return prev
      return [...prev, ingredient]
    })
  }

  function toggleSaved(recipeName: string) {
    setRecipePrefs((prev) => {
      const current = prev[recipeName] ?? {}
      return {
        ...prev,
        [recipeName]: { ...current, saved: !current.saved },
      }
    })
  }

  function setFeedback(recipeName: string, feedback: RecipeFeedback) {
    setRecipePrefs((prev) => {
      const current = prev[recipeName] ?? {}
      const next = current.feedback === feedback ? 'neutral' : feedback
      return {
        ...prev,
        [recipeName]: { ...current, feedback: next },
      }
    })
  }

  return (
    <HashRouter>
      <Shell
        manualIngredients={manualIngredients}
        setManualIngredients={setManualIngredients}
        substituteIngredients={substituteIngredients}
        addSubstituteIngredient={addSubstituteIngredient}
        effectivePantry={effectivePantry}
        recipePrefs={recipePrefs}
        toggleSaved={toggleSaved}
        setFeedback={setFeedback}
      />
    </HashRouter>
  )
}

type ShellProps = {
  manualIngredients: string[]
  setManualIngredients: (next: string[]) => void
  substituteIngredients: string[]
  addSubstituteIngredient: (ingredient: string) => void
  // We only need a clearer when pantry is emptied in HomePage; for now, HomePage
  // already receives onClearSubstitutes via an inline callback.
  effectivePantry: string[]
  recipePrefs: RecipePrefs
  toggleSaved: (recipeName: string) => void
  setFeedback: (recipeName: string, fb: RecipeFeedback) => void
}

function Shell({
  manualIngredients,
  setManualIngredients,
  substituteIngredients,
  addSubstituteIngredient,
  effectivePantry,
  recipePrefs,
  toggleSaved,
  setFeedback,
}: ShellProps) {
  const location = useLocation()
  useNavigate()

  return (
    <div className="min-h-dvh text-zinc-900">
      <header
        className={[
          'sticky top-0 z-[60] border-b border-zinc-200/70 backdrop-blur',
          'bg-[#fefae0]/80',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <NavLink
            to="/"
            end
            className="inline-flex items-center rounded-md focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
            aria-label="Go to home"
          >
            <img
              src={logoImg}
              alt="SmartPantry"
              className="h-40 w-40 max-h-40 max-w-40 rounded-full object-cover ring-2 ring-white/70"
              decoding="async"
            />
          </NavLink>

          <nav className="ml-6 flex items-center gap-8 text-sm font-semibold text-[#554336]">
            {/* Use plain hash hrefs to be extra reliable in static/demo setups. */}
            <a href="#/pantry" className="hover:text-[#1d1c0d]" aria-label="Pantry">
              Pantry
            </a>
            <a
              href="#/budget"
              className="hover:text-[#1d1c0d]"
              aria-label="Meal Planner"
            >
              Meal Planner
            </a>
            <a href="#/saved" className="hover:text-[#1d1c0d]" aria-label="Recipes">
              Recipes
            </a>
          </nav>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={<OpeningPage />}
        />
        <Route
          path="/pantry"
          element={
            <HomePage
              manualIngredients={manualIngredients}
              onManualIngredientsChange={setManualIngredients}
              substituteIngredients={substituteIngredients}
              onAddSubstituteIngredient={addSubstituteIngredient}
              onClearSubstitutes={() => {}}
              recipePrefs={recipePrefs}
              onToggleSaved={toggleSaved}
              onSetFeedback={setFeedback}
            />
          }
        />
        <Route
          path="/budget"
          element={
            <BudgetPage
              pantryIngredients={effectivePantry}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedPage
              recipePrefs={recipePrefs}
              onToggleSaved={toggleSaved}
              onSetFeedback={setFeedback}
            />
          }
        />
      </Routes>
    </div>
  )
}

