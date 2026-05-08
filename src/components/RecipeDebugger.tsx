import { useEffect, useMemo, useRef, useState } from 'react'

export type DebugMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

type RecipeDebuggerProps = {
  open: boolean
  onClose: () => void
  context?: {
    recipeName?: string
    skillLevel?: string
    stepNumber?: number
    stepCount?: number
    stepText?: string
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function generateMockAiResponse(args: {
  userText: string
  context?: RecipeDebuggerProps['context']
}) {
  const { userText, context } = args
  const lower = userText.toLocaleLowerCase()

  const recipe = context?.recipeName
  const level = context?.skillLevel ?? 'Beginner'

  const recipeHint = (() => {
    if (!recipe) return null
    if (/scrambled eggs/i.test(recipe))
      return 'With scrambled eggs, the biggest lever is heat control—low and slow prevents rubbery curds.'
    if (/avocado toast/i.test(recipe))
      return 'For avocado toast, contrast matters: crisp toast + seasoned avocado + gently cooked eggs.'
    if (/garlic olive oil pasta/i.test(recipe))
      return 'For garlic oil pasta, the key is gentle garlic—browning turns it bitter fast.'
    if (/buttered pasta/i.test(recipe))
      return 'For buttered pasta, pasta water helps the butter cling instead of pooling.'
    if (/fried rice/i.test(recipe))
      return 'For fried rice, moisture is the enemy—cold, dry rice browns better than fresh hot rice.'
    if (/stir fry/i.test(recipe))
      return 'For stir fry, crowding cools the pan and causes steaming instead of searing.'
    if (/roasted potatoes/i.test(recipe))
      return 'For roasted potatoes, a hot oven + space on the tray drives browning and crisp edges.'
    if (/grilled cheese/i.test(recipe))
      return 'For grilled cheese, medium-low heat melts the center before the bread over-browns.'
    return null
  })()

  const likelyWentWrong = (() => {
    if (/(burn|burnt|scorch|smoke)/.test(lower))
      return 'Heat was a bit too high, so the food browned faster than expected.'
    if (/(watery|soggy|mushy)/.test(lower))
      return 'There may have been extra moisture in the pan, which can prevent browning and make things soft.'
    if (/(stick|stuck)/.test(lower))
      return 'The pan may not have been hot enough (or there wasn’t quite enough fat), so the food grabbed onto the surface.'
    if (/(salty|too salty)/.test(lower))
      return 'Seasoning likely concentrated as it cooked, or the soy/salt was added a little heavy-handed.'
    if (/(bland|no flavor)/.test(lower))
      return 'It probably needed one more “finisher” to wake it up—salt, a bit of acid, or an aromatic at the end.'
    if (/(raw|undercook|undercooked)/.test(lower))
      return 'It likely needed a few more minutes of steady heat, or the pieces were a bit large for the time.'
    return 'One small variable (heat, timing, or moisture) likely drifted off course—super common, and totally fixable.'
  })()

  const fixNow = (() => {
    if (/(burn|burnt|scorch|smoke)/.test(lower))
      return [
        'Take the pan off the heat for 30–60 seconds to stop the cooking.',
        'If there are burnt bits, move the food to a clean pan (don’t scrape the black parts in).',
        'Continue on medium-low and stir/toss more often.',
      ]
    if (/(watery|soggy|mushy)/.test(lower))
      return [
        'Turn the heat up slightly and spread the food out so steam can escape.',
        'Cook a few minutes uncovered, stirring less often to let moisture evaporate.',
        'If it’s a sauce, add a little starch (pasta water, rice, or a small sprinkle of cheese) to help it cling.',
      ]
    if (/(stick|stuck)/.test(lower))
      return [
        'Let it cook undisturbed for 30–60 seconds—often it releases when it browns.',
        'Add a small splash of water and cover briefly to loosen, then gently scrape.',
        'Lower the heat slightly and add a touch more oil/butter.',
      ]
    if (/(salty|too salty)/.test(lower))
      return [
        'Add an unsalted ingredient to dilute (more rice/pasta/veg/egg).',
        'Add a tiny bit of acid (lemon/vinegar) to balance, then re-taste.',
        'Avoid adding more salty toppings until it tastes right.',
      ]
    if (/(bland|no flavor)/.test(lower))
      return [
        'Add a small pinch of salt, then taste again.',
        'Add brightness: a squeeze of lemon or a dash of vinegar.',
        'Finish with something aromatic (pepper, garlic, herbs, or chili flakes).',
      ]
    if (/(raw|undercook|undercooked)/.test(lower))
      return [
        'Lower to medium heat and cook a few minutes longer, stirring occasionally.',
        'If pieces are large, cover for 1–2 minutes to trap heat, then uncover to finish.',
        'Taste a small bite to confirm doneness before serving.',
      ]
    return [
      'Reduce to medium-low and slow down the pace for 2–3 minutes.',
      'Taste, then adjust one thing at a time (salt, heat, moisture).',
      'If it feels off, pause and reset: move to a clean pan and keep going gently.',
    ]
  })()

  const levelTweaks = (() => {
    if (level === 'Pro')
      return {
        prefix: 'Quick pro-mode adjustments:',
        extra: ['Taste → adjust one variable → repeat. Keep heat changes small and deliberate.'],
      }
    if (level === 'Home Cook')
      return {
        prefix: 'A steady, home-cook approach:',
        extra: ['Keep the pan at medium or medium-low and give it a minute between adjustments.'],
      }
    return {
      prefix: 'Let’s keep it simple:',
      extra: ['If you’re unsure, lower the heat and go slowly. You can always speed up later.'],
    }
  })()

  const preventionTip = (() => {
    if (/(burn|burnt|scorch|smoke)/.test(lower))
      return 'Prevention tip: start one heat level lower than you think, and bump it up only if progress is too slow.'
    if (/(watery|soggy|mushy)/.test(lower))
      return 'Prevention tip: pat ingredients dry and avoid crowding the pan so you get sautéing—not steaming.'
    if (/(stick|stuck)/.test(lower))
      return 'Prevention tip: preheat the pan, then add oil, then the food—this order helps reduce sticking.'
    if (/(salty|too salty)/.test(lower))
      return 'Prevention tip: season in small pinches as you go, especially when using salty sauces like soy sauce.'
    if (/(bland|no flavor)/.test(lower))
      return 'Prevention tip: keep a simple “finisher” nearby (lemon, chili flakes, black pepper, herbs) for the last 30 seconds.'
    if (/(raw|undercook|undercooked)/.test(lower))
      return 'Prevention tip: keep pieces a similar size so they cook at the same speed.'
    return 'Prevention tip: taste early, taste often—tiny adjustments are easier than big corrections.'
  })()

  const contextLine =
    recipe || context?.skillLevel || context?.stepNumber
      ? `Context I’m using: ${
          [
            recipe ? `Recipe: ${recipe}` : null,
            context?.skillLevel ? `Level: ${context.skillLevel}` : null,
            context?.stepNumber && context?.stepCount
              ? `Step: ${context.stepNumber} of ${context.stepCount}`
              : null,
            context?.stepText ? `Step text: ${context.stepText}` : null,
          ]
            .filter(Boolean)
            .join(' — ')
        }`
      : null

  return [
    'Thanks for telling me — that sounds frustrating, but you’re doing great. We can recover this.',
    contextLine,
    '',
    `What likely went wrong: ${likelyWentWrong}`,
    recipeHint ? `Recipe-specific note: ${recipeHint}` : null,
    '',
    `${levelTweaks.prefix} How to fix it right now:`,
    ...fixNow.map((s) => `- ${s}`),
    ...levelTweaks.extra.map((s) => `- ${s}`),
    '',
    preventionTip,
  ]
    .filter(Boolean)
    .join('\n')
}

export default function RecipeDebugger({
  open,
  onClose,
  context,
}: RecipeDebuggerProps) {
  const [input, setInput] = useState('')

  const introText = useMemo(() => {
    const base =
      'Hi — I’m your AI sous-chef. Tell me what happened, and we’ll fix it together, one calm step at a time.'
    const contextLine =
      context?.recipeName || context?.stepText
        ? [
            context?.recipeName ? `Recipe: ${context.recipeName}` : null,
            context?.skillLevel ? `Level: ${context.skillLevel}` : null,
            context?.stepNumber && context?.stepCount
              ? `Step ${context.stepNumber} of ${context.stepCount}`
              : null,
            context?.stepText ? `Step: ${context.stepText}` : null,
          ]
            .filter(Boolean)
            .join(' — ')
        : null
    return contextLine ? `${base}\n\n${contextLine}` : base
  }, [context])

  const [messages, setMessages] = useState<DebugMessage[]>(() => [
    { id: uid(), role: 'assistant', text: introText },
  ])

  // Keep the intro message in sync when context changes (without clearing history).
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) return [{ id: uid(), role: 'assistant', text: introText }]
      const first = prev[0]
      if (first.role !== 'assistant') return prev
      if (!first.text.startsWith('Hi — I’m your AI sous-chef.')) return prev
      if (first.text === introText) return prev
      return [{ ...first, text: introText }, ...prev.slice(1)]
    })
  }, [introText])

  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null

  function resetChat() {
    setMessages([{ id: uid(), role: 'assistant', text: introText }])
    setInput('')
  }

  function send() {
    const text = input.trim()
    if (!text) return

    const userMsg: DebugMessage = { id: uid(), role: 'user', text }
    const assistantMsg: DebugMessage = {
      id: uid(),
      role: 'assistant',
      text: generateMockAiResponse({ userText: text, context }),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close recipe debugger"
      />

      <div
        className="relative w-full max-w-[380px] overflow-hidden rounded-[32px] border border-[#dbc2b0] bg-white shadow-lg"
        style={{ boxShadow: '0 0 25px rgba(255, 183, 125, 0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#8d4b00] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdcc3]">
              <span className="text-[#8d4b00]" aria-hidden="true">
                🤖
              </span>
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold">AI Sous-Chef</p>
              <p className="text-xs opacity-80">Recipe Debugger</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
            aria-label="Close AI chat"
          >
            ×
          </button>
        </div>

        {/* Chat canvas */}
        <div
          className="max-h-[400px] space-y-4 overflow-y-auto p-6"
          style={{
            background:
              'radial-gradient(circle at top right, #fffbf2, transparent)',
          }}
        >
          {/* Messages */}
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  'flex',
                  m.role === 'user' ? 'justify-end' : 'justify-start',
                ].join(' ')}
              >
                <div
                  className={[
                    'max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-5',
                    m.role === 'assistant'
                      ? 'rounded-tl-none bg-[#ede9cf] text-[#1d1c0d]'
                      : 'bg-[#323120] text-[#f5f1d8]',
                  ].join(' ')}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick kitchen hacks */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-[#8f4a00]">
              <span aria-hidden="true">⚡</span>
              <span className="text-xs font-semibold tracking-widest">
                QUICK KITCHEN HACKS
              </span>
            </div>

            <button
              type="button"
              onClick={() => setInput('Too salty?')}
              className="w-full rounded-2xl border border-transparent bg-[#ede9cf] p-4 text-left transition hover:border-[#dbc2b0] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#887364]" aria-hidden="true">
                  ⓘ
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1d1c0d]">
                    Too salty?
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#554336]">
                    Don&apos;t add salt now! Wait until they&apos;re nearly
                    finished in the pan to avoid moisture loss.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Interaction zone */}
        <div className="p-6 pt-0">
          <div className="relative mb-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                e.preventDefault()
                send()
              }}
              placeholder="Something else feels off?"
              className="w-full rounded-2xl border-2 border-[#dbc2b0] bg-[#f8f4db] px-4 py-3 text-sm text-[#1d1c0d] outline-none transition placeholder:text-[#554336]/50 focus:border-[#8d4b00] focus:ring-4 focus:ring-[#8d4b00]/15"
            />
            <button
              type="button"
              onClick={send}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#8d4b00] text-white shadow-md transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/20"
              aria-label="Send message"
            >
              ➤
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['I think I burned it', 'Pan is too hot'].map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => {
                  setInput(text)
                  // Don’t auto-send: match the design’s “chip fills input”.
                }}
                className="whitespace-nowrap rounded-full border border-[#dbc2b0] bg-[#f2efd5] px-4 py-2 text-sm font-semibold text-[#554336] transition hover:bg-[#e7e3ca] focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
              >
                {text}
              </button>
            ))}

            <button
              type="button"
              onClick={resetChat}
              className="whitespace-nowrap rounded-full border border-[#dbc2b0] bg-white/70 px-4 py-2 text-sm font-semibold text-[#554336] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#8d4b00]/15"
            >
              Reset
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-[#554336]/70">
            Supportive mode: troubleshooting gently.
          </p>
        </div>
      </div>
    </div>
  )
}

