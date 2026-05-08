type RecipeLike = {
  name: string
  coreIngredients: readonly string[]
  optionalIngredients?: readonly string[]
}

export type RecipeMatch<TRecipe extends RecipeLike = RecipeLike> = {
  recipe: TRecipe
  matchPercent: number
  missingCount: number
  missingCoreIngredients: string[]
  statusLabel: string
}

export function normalizeIngredient(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function expandIngredientAlternatives(normalizedIngredient: string) {
  // Support mock strings like "butter or oil".
  return normalizedIngredient
    .split(/\s+or\s+|\s*\/\s*|,\s*/g)
    .map((x) => x.trim())
    .filter(Boolean)
}

function isWordChar(ch: string) {
  return /[a-z0-9]/.test(ch)
}

function pantryTokenContainsRecipeToken(pantryToken: string, recipeToken: string) {
  if (!pantryToken || !recipeToken) return false
  if (pantryToken === recipeToken) return true

  const idx = pantryToken.indexOf(recipeToken)
  if (idx === -1) return false

  const charBefore = idx === 0 ? '' : (pantryToken[idx - 1] ?? '')
  const charAfter = pantryToken[idx + recipeToken.length] ?? ''

  const leftOk = idx === 0 || !isWordChar(charBefore)
  if (!leftOk) return false

  // If the recipe token is followed by a space, only allow fuzzy matches when the
  // remainder looks like a simple modifier ("cooked rice"), not a qualifier bundle
  // like "salt (and ...)".
  if (charAfter === ' ') {
    const rest = pantryToken.slice(idx + recipeToken.length).trimStart()
    if (rest.startsWith('(') || rest.startsWith('[')) return false
    if (/^(and|with|\+)/.test(rest)) return false
  }

  const rightOk = charAfter === '' || !isWordChar(charAfter)
  return rightOk
}

export function ingredientIncludedByPantry(
  normalizedPantry: readonly string[],
  normalizedRecipeIngredient: string,
) {
  if (!normalizedRecipeIngredient) return false

  // Exact match first.
  if (normalizedPantry.includes(normalizedRecipeIngredient)) return true

  const recipeAlts = expandIngredientAlternatives(normalizedRecipeIngredient)

  // Demo-friendly fuzzy match: allow "rice" to match "cooked rice", etc.
  return normalizedPantry.some((p) => {
    if (!p) return false
    return recipeAlts.some((alt) => pantryTokenContainsRecipeToken(p, alt))
  })
}

function statusFromMissing(missingCount: number) {
  if (missingCount <= 0) return '100% match'
  if (missingCount === 1) return 'Missing 1 ingredient'
  return `Missing ${missingCount} ingredients`
}

export function comparePantryToRecipes<TRecipe extends RecipeLike>(
  pantryIngredients: readonly string[],
  recipes: readonly TRecipe[],
): RecipeMatch<TRecipe>[] {
  const normalizedPantry = pantryIngredients.map(normalizeIngredient).filter(Boolean)

  const matches = recipes.map((recipe) => {
    const core = recipe.coreIngredients
      .map((x) => x.trim())
      .filter(Boolean)

    const missingCoreIngredients = core.filter(
      (ingredient) =>
        !ingredientIncludedByPantry(
          normalizedPantry,
          normalizeIngredient(ingredient),
        ),
    )

    const coreCount = core.length
    const missingCount = missingCoreIngredients.length
    const matchedCount = Math.max(0, coreCount - missingCount)
    const matchPercent =
      coreCount === 0 ? 0 : Math.round((matchedCount / coreCount) * 100)

    return {
      recipe,
      matchPercent,
      missingCount,
      missingCoreIngredients,
      statusLabel: statusFromMissing(missingCount),
    }
  })

  // Best match first: fewer missing core ingredients; tiebreaker is higher percent; then name.
  matches.sort((a, b) => {
    if (a.missingCount !== b.missingCount) return a.missingCount - b.missingCount
    if (a.matchPercent !== b.matchPercent) return b.matchPercent - a.matchPercent
    return a.recipe.name.localeCompare(b.recipe.name)
  })

  return matches
}

