import { normalizeIngredient } from './recipeMatch'

// Demo pricing (rough estimates). Keep simple and tweak as needed.
const PRICE_BY_INGREDIENT: Record<string, number> = {
  eggs: 3.5,
  bread: 3.0,
  avocado: 1.5,
  butter: 4.0,
  oil: 4.0,
  'olive oil': 6.0,
  garlic: 0.75,
  'garlic powder': 2.5,
  salt: 1.25,
  pepper: 2.5,
  pasta: 2.0,
  cheese: 4.0,
  parmesan: 4.5,
  rice: 2.5,
  'cooked rice': 2.5,
  'soy sauce': 3.0,
  'mixed vegetables': 3.0,
  potatoes: 3.0,
  tomato: 1.0,
  lemon: 0.75,
  lime: 0.75,
  'green onions': 1.0,
  spinach: 2.5,
  peas: 2.0,
  tuna: 1.5,
  tofu: 3.0,
}

export function priceForIngredient(ingredient: string) {
  const key = normalizeIngredient(ingredient)
  return PRICE_BY_INGREDIENT[key] ?? 2.5
}

export function formatUsd(amount: number) {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

