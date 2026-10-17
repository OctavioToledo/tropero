import { Plus } from 'lucide-react'
import type { Product } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store'
import { Badges, ProductMedia } from './ProductMedia'

export function ProductCard({ product: p }: { product: Product }) {
  const { openProduct } = useStore()
  return (
    <button
      type="button"
      className={`card has-zoom${p.available ? '' : ' is-off'}`}
      onClick={() => p.available && openProduct(p.id)}
      aria-disabled={!p.available}
      aria-label={p.available ? `${p.name}, ${money(p.price)}. Ver y agregar` : `${p.name}: hoy no hay`}
    >
      <div className="card__media">
        <ProductMedia product={p} />
        <Badges badges={p.badges} />
        {!p.available && <span className="off-tag">Hoy no hay</span>}
      </div>
      <div className="card__body">
        <h4 className="card__name">{p.name}</h4>
        <p className="card__desc">{p.description}</p>
        <div className="card__foot">
          <span className="price">{money(p.price)}</span>
          {p.available && (
            <span className="add-dot" aria-hidden="true">
              <Plus strokeWidth={2.25} />
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
