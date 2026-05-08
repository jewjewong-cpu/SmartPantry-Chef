export type Mood = 'Calm' | 'Stressed' | 'Cozy' | 'Adventurous'

type MoodSelectionProps = {
  mood: Mood
  onMoodChange: (mood: Mood) => void
}

const MOODS: Mood[] = ['Calm', 'Stressed', 'Cozy', 'Adventurous']

export default function MoodSelection({ mood, onMoodChange }: MoodSelectionProps) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-zinc-800">Mood</h3>
        <p className="text-sm leading-6 text-zinc-600">
          Pick a vibe — we’ll keep the UI gentle and adjust subtly.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => {
          const selected = m === mood
          return (
            <button
              key={m}
              type="button"
              onClick={() => onMoodChange(m)}
              aria-pressed={selected}
              className={[
                'rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition',
                'focus:outline-none focus:ring-4 focus:ring-zinc-200/60',
                selected
                  ? 'border-zinc-300 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50',
              ].join(' ')}
            >
              {m}
            </button>
          )
        })}
      </div>
    </section>
  )
}

