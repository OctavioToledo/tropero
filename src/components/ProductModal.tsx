import { Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { OptionGroup, Product } from '../data/products'
import { defaultSelections, findProduct, unitPrice, type Selections } from '../lib/cart'
import { money } from '../lib/format'
import { useStore } from '../store'
import { Badges, ProductMedia } from './ProductMedia'
import { Sheet } from './Sheet'

export function ProductModal() {
  const { productId, openProduct } = useStore()
  // Guardamos el último producto para que la animación de salida no quede vacía
  const [last, setLast] = useState<Product | null>(null)
  const product = productId ? (findProduct(productId) ?? null) : null
  useEffect(() => {
    if (product) setLast(product)
  }, [product])

  const shown = product ?? last
  return (
    <Sheet open={!!product} onClose={() => openProduct(null)} label={shown?.name ?? 'Producto'} desktop="center">
      {shown && <ProductForm key={shown.id} product={shown} />}
    </Sheet>
  )
}

function hint(g: OptionGroup) {
  if (g.required) return 'Obligatorio'
  if (g.type === 'multiple' && g.max) return `Hasta ${g.max}`
  return 'Opcional'
}

function ProductForm({ product }: { product: Product }) {
  const { add, openProduct } = useStore()
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(product))
  const [note, setNote] = useState('')
  const [qty, setQty] = useState(1)
  const mediaRef = useRef<HTMLDivElement>(null)

  const toggle = (g: OptionGroup, optionId: string) => {
    setSelections((prev) => {
      const current = prev[g.id] ?? []
      if (g.type === 'single') {
        if (current[0] === optionId) return g.required ? prev : { ...prev, [g.id]: [] }
        return { ...prev, [g.id]: [optionId] }
      }
      if (current.includes(optionId)) return { ...prev, [g.id]: current.filter((id) => id !== optionId) }
      if (g.max && current.length >= g.max) return prev
      return { ...prev, [g.id]: [...current, optionId] }
    })
  }

  const missing = (product.optionGroups ?? []).some((g) => g.required && !(selections[g.id] ?? []).length)
  const total = unitPrice(product, selections) * qty

  const submit = () => {
    if (missing) return
    add(product.id, selections, note, qty, mediaRef.current)
    openProduct(null)
  }

  const footer = (
    <div className="sheet__footer pm__actions">
      <div className="stepper" role="group" aria-label="Cantidad">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Restar uno"
        >
          <Minus strokeWidth={2} />
        </button>
        <output aria-live="polite">{qty}</output>
        <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Sumar uno">
          <Plus strokeWidth={2} />
        </button>
      </div>
      <button type="button" className="btn btn--primary" onClick={submit} disabled={missing}>
        Agregar · <span style={{ fontVariantNumeric: 'tabular-nums' }}>{money(total)}</span>
      </button>
    </div>
  )

  return (
    <>
      <div className="sheet__scroll">
        <div className="pm__media" ref={mediaRef}>
          <ProductMedia product={product} sizes="(min-width: 768px) 560px, 100vw" eager />
          <Badges badges={product.badges} />
        </div>
        <div className="pm__body">
          <h2 className="pm__title">{product.name}</h2>
          <p className="pm__desc">{product.description}</p>
          <p className="price pm__base" style={{ margin: 0 }}>
            {money(product.price)}
          </p>
        </div>

        {(product.optionGroups ?? []).map((g) => {
          const chosen = selections[g.id] ?? []
          const full = g.type === 'multiple' && !!g.max && chosen.length >= g.max
          return (
            <fieldset className="og" key={g.id}>
              <legend>
                {g.name}
                <span className={`og__hint${g.required ? ' is-required' : ''}`}>{hint(g)}</span>
              </legend>
              {g.options.map((o) => {
                const checked = chosen.includes(o.id)
                return (
                  <label className="opt" key={o.id}>
                    <input
                      type={g.type === 'single' ? 'radio' : 'checkbox'}
                      name={`${product.id}-${g.id}`}
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() => toggle(g, o.id)}
                      onClick={(e) => {
                        // permitir destildar un radio opcional
                        if (g.type === 'single' && !g.required && checked) {
                          e.preventDefault()
                          toggle(g, o.id)
                        }
                      }}
                    />
                    <span className="opt__name">{o.name}</span>
                    {o.price !== 0 && (
                      <span className="opt__price">
                        {o.price > 0 ? '+' : '−'}
                        {money(Math.abs(o.price))}
                      </span>
                    )}
                  </label>
                )
              })}
            </fieldset>
          )
        })}

        <div className="og">
          <div className="field">
            <label htmlFor="pm-note">
              Aclaraciones <small>(opcional)</small>
            </label>
            <textarea
              id="pm-note"
              className="textarea"
              placeholder="Ej: bien cocido, cortado al medio…"
              maxLength={140}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
      {footer}
    </>
  )
}
