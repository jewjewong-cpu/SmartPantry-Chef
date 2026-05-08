import { useState } from 'react'
import BudgetPlanner from '../components/BudgetPlanner'
import { mockRecipes } from '../data/mockRecipes'

type BudgetPageProps = {
  pantryIngredients: readonly string[]
}

export default function BudgetPage({
  pantryIngredients,
}: BudgetPageProps) {
  const [weeklyBudget, setWeeklyBudget] = useState<number>(0)

  return (
    <div className="min-h-dvh bg-[#fefae0] text-[#1d1c0d]">
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <div className="space-y-8">
          <header className="space-y-2">
            <h2 className="font-['Literata'] text-3xl font-semibold tracking-tight text-[#8d4b00]">
              Meal Planner
            </h2>
            <p className="text-sm leading-6 text-[#554336]">
              Design your weekly culinary journey within your means.
            </p>
          </header>

          <BudgetPlanner
            budget={weeklyBudget}
            onBudgetChange={setWeeklyBudget}
            pantryIngredients={pantryIngredients}
            recipes={mockRecipes}
          />
        </div>
      </main>
    </div>
  )
}

