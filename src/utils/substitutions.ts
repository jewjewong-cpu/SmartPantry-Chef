export type SubstitutionChoice = {
  label: string
  pantryItem: string
}

function norm(s: string) {
  return s.trim().toLocaleLowerCase()
}

// Demo-focused substitutions: simple, friendly, and intentionally not exhaustive.
export function substitutionChoicesFor(
  recipeIngredient: string,
): SubstitutionChoice[] {
  const m = norm(recipeIngredient)

  if (m.includes('butter') && m.includes('oil')) {
    return [
      { label: 'Use butter', pantryItem: 'butter' },
      { label: 'Use oil', pantryItem: 'oil' },
    ]
  }
  if (m.includes('lemon') && m.includes('lime')) {
    return [
      { label: 'Use lemon', pantryItem: 'lemon' },
      { label: 'Use lime', pantryItem: 'lime' },
    ]
  }
  if (m.includes('frozen peas')) {
    return [
      { label: 'Use peas', pantryItem: 'peas' },
      { label: 'Use mixed vegetables', pantryItem: 'mixed vegetables' },
    ]
  }

  const directChoices: Partial<Record<string, SubstitutionChoice[]>> = {
    butter: [{ label: 'Use oil instead', pantryItem: 'oil' }],
    oil: [{ label: 'Use butter instead', pantryItem: 'butter' }],
    'olive oil': [{ label: 'Use any neutral cooking oil', pantryItem: 'oil' }],
    garlic: [{ label: 'Use garlic powder (pinch)', pantryItem: 'garlic powder' }],
    'soy sauce': [
      { label: 'Use salt + a splash of vinegar/lemon', pantryItem: 'salt' },
    ],
    cheese: [{ label: 'Skip cheese; bump salt/pepper', pantryItem: 'black pepper' }],
    bread: [{ label: 'Serve on rice/potatoes', pantryItem: 'rice' }],
    pasta: [{ label: 'Swap to rice/potatoes base', pantryItem: 'potatoes' }],
    potatoes: [{ label: 'Use carrots/cauliflower', pantryItem: 'carrots' }],
    avocado: [{ label: 'Swap for tomato', pantryItem: 'tomato' }],
    eggs: [{ label: 'Use tofu/beans instead', pantryItem: 'tofu or beans' }],
  }

  if (directChoices[m]) return directChoices[m]!

  const fuzzyChoices: SubstitutionChoice[][] = []
  const pushIf = (
    predicate: boolean,
    choices: SubstitutionChoice[] | undefined,
  ) => {
    if (!predicate || !choices) return
    fuzzyChoices.push(choices)
  }

  pushIf(m.includes('butter'), directChoices.butter)
  pushIf(m.includes('olive oil'), directChoices['olive oil'])
  pushIf(m.includes('soy'), directChoices['soy sauce'])
  pushIf(m.includes('garlic'), directChoices.garlic)
  pushIf(m.includes('potato'), directChoices.potatoes)
  pushIf(m.includes('cheese'), directChoices.cheese)
  pushIf(m.includes('bread'), directChoices.bread)
  pushIf(m.includes('pasta'), directChoices.pasta)
  pushIf(m.includes('avocado'), directChoices.avocado)
  pushIf(m.includes('egg'), directChoices.eggs)

  const dedupMap = new Map<string, SubstitutionChoice>()
  const merged = fuzzyChoices.flat()
  for (const c of merged) {
    dedupMap.set(`${c.label}::${c.pantryItem}`, c)
  }
  if (dedupMap.size > 0) return [...dedupMap.values()]

  return []
}

/** @deprecated Prefer `substitutionChoicesFor` for clickable demo flows. */
export function suggestSubstitute(missingIngredient: string): string | null {
  const choices = substitutionChoicesFor(missingIngredient)
  if (choices.length === 0) return null
  const first = choices[0]
  return `No problem — ${choices.length > 1 ? 'try:' : `${first.label}:`} ${choices.map((c) => c.label).join(' · ')}`
}

