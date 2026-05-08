import { useMemo, useState } from 'react'

type CookingModeProps = {
  steps: readonly string[]
  onSomethingWentWrong?: (context: { stepIndex: number; stepText: string }) => void
}

export default function CookingMode({
  steps,
  onSomethingWentWrong,
}: CookingModeProps) {
  const [stepIndex, setStepIndex] = useState(0)

  const safeIndex = Math.min(Math.max(stepIndex, 0), Math.max(steps.length - 1, 0))
  const stepText = useMemo(() => steps[safeIndex] ?? '', [safeIndex, steps])
  const isLastStep = safeIndex >= steps.length - 1

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-500">
          Step {steps.length === 0 ? 0 : safeIndex + 1} of {steps.length}
        </p>
        <p className="text-sm leading-6 text-zinc-800">{stepText || 'No steps yet.'}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={steps.length === 0 || isLastStep}
          onClick={() => setStepIndex((i) => Math.min(i + 1, steps.length - 1))}
          className={[
            'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition',
            'focus:outline-none focus:ring-4 focus:ring-zinc-200/60',
            steps.length === 0 || isLastStep
              ? 'cursor-not-allowed bg-zinc-200 text-zinc-600'
              : 'bg-zinc-900 text-white hover:bg-zinc-800',
          ].join(' ')}
        >
          Next step
        </button>

        <button
          type="button"
          onClick={() =>
            onSomethingWentWrong?.({ stepIndex: safeIndex, stepText })
          }
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200/60"
        >
          Something went wrong
        </button>
      </div>
    </section>
  )
}

