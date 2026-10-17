import { products, type Product } from '../data/products'

/** groupId -> optionIds elegidas */
export type Selections = Record<string, string[]>

export interface CartLine {
  key: string
  productId: string
  qty: number
  selections: Selections
  note: string
}

export interface CheckoutForm {
  name: string
  mode: 'retiro' | 'delivery'
  address: string
  reference: string
  payment: 'efectivo' | 'transferencia'
  cashAmount: string
  comments: string
}

export const emptyForm: CheckoutForm = {
  name: '',
  mode: 'delivery',
  address: '',
  reference: '',
  payment: 'efectivo',
  cashAmount: '',
  comments: '',
}

const byId = new Map(products.map((p) => [p.id, p]))
export const findProduct = (id: string) => byId.get(id)

/** Mismo producto + mismas opciones + misma nota = misma línea */
export function lineKey(productId: string, selections: Selections, note: string) {
  const sorted = Object.keys(selections)
    .sort()
    .map((g) => `${g}:${[...selections[g]].sort().join(',')}`)
    .join('|')
  return `${productId}#${sorted}#${note.trim().toLowerCase()}`
}

export function unitPrice(product: Product, selections: Selections) {
  let total = product.price
  for (const group of product.optionGroups ?? []) {
    for (const optId of selections[group.id] ?? []) {
      total += group.options.find((o) => o.id === optId)?.price ?? 0
    }
  }
  return total
}

/** Texto legible de las opciones: tamaño entre paréntesis, agregados con "+", "Sacale" como "Sin …" */
export function describeSelections(product: Product, selections: Selections) {
  let variant = ''
  const extras: string[] = []
  const removals: string[] = []
  for (const group of product.optionGroups ?? []) {
    const chosen = (selections[group.id] ?? [])
      .map((id) => group.options.find((o) => o.id === id))
      .filter((o) => o !== undefined)
    if (!chosen.length) continue
    if (group.type === 'single' && group.required) variant = chosen.map((o) => o.name.toLowerCase()).join(', ')
    else if (group.id === 'sacale') removals.push(...chosen.map((o) => o.name))
    else extras.push(...chosen.map((o) => o.name))
  }
  return { variant, extras, removals }
}

export function lineTitle(product: Product, selections: Selections) {
  const { variant } = describeSelections(product, selections)
  return variant ? `${product.name} (${variant})` : product.name
}

/** Defaults: en grupos single obligatorios, la primera opción */
export function defaultSelections(product: Product): Selections {
  const s: Selections = {}
  for (const g of product.optionGroups ?? []) {
    s[g.id] = g.type === 'single' && g.required ? [g.options[0].id] : []
  }
  return s
}
