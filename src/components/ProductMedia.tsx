import { UtensilsCrossed } from 'lucide-react'
import { categories, type Badge, type Product } from '../data/products'

const badgeClass: Record<Badge, string> = {
  Estrella: 'badge',
  Nuevo: 'badge badge--nuevo',
  Picante: 'badge badge--picante',
  Veggie: 'badge badge--veggie',
}

export function Badges({ badges }: { badges?: Badge[] }) {
  if (!badges?.length) return null
  return (
    <div className="media__badges">
      {badges.map((b) => (
        <span key={b} className={badgeClass[b]}>
          {b === 'Estrella' ? '★ ' : ''}
          {b}
        </span>
      ))}
    </div>
  )
}

/** Foto del producto (webp responsive) o placeholder con textura y nombre si todavía no hay foto */
export function ProductMedia({
  product,
  sizes = '(min-width: 1200px) 300px, (min-width: 600px) 45vw, 92vw',
  eager = false,
  showName = true,
}: {
  product: Product
  sizes?: string
  eager?: boolean
  showName?: boolean
}) {
  const img = product.image
  if (!img) {
    return (
      <div className="placeholder" aria-hidden="true">
        <UtensilsCrossed strokeWidth={1.75} />
        {showName && <span className="placeholder__name">{product.name}</span>}
        {showName && (
          <span className="placeholder__cat">{categories.find((c) => c.id === product.category)?.name}</span>
        )}
      </div>
    )
  }
  return (
    <div className="media">
      <img
        src={`/img/${img.id}-480.webp`}
        srcSet={`/img/${img.id}-480.webp 480w, /img/${img.id}-960.webp ${img.w}w`}
        sizes={sizes}
        width={img.w}
        height={img.h}
        alt={img.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
