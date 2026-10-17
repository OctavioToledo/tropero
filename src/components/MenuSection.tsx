import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { categories, products, type CategoryId } from '../data/products'
import { ProductCard } from './ProductCard'
import { Reveal } from './Reveal'

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function MenuSection() {
  const [active, setActive] = useState<CategoryId | 'todo'>('todo')
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = normalize(query.trim())
    return categories
      .filter((c) => active === 'todo' || c.id === active)
      .map((c) => ({
        category: c,
        items: products.filter(
          (p) =>
            p.category === c.id &&
            (!q || normalize(`${p.name} ${p.description} ${(p.fillings ?? []).join(' ')}`).includes(q)),
        ),
      }))
      .filter((g) => g.items.length)
  }, [active, query])

  const choose = (id: CategoryId | 'todo') => {
    setActive(id)
    document.getElementById('menu-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="section section--alt" id="menu" aria-labelledby="menu-title">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">El menú completo</span>
          <h2 className="display h2" id="menu-title">
            Y algo más
          </h2>
          <p className="accent">porque no todo en la vida es envueltito (casi)</p>
        </Reveal>

        <div className="menu-tools">
          <div className="chips" role="toolbar" aria-label="Filtrar por categoría">
            <button type="button" className="chip" aria-pressed={active === 'todo'} onClick={() => choose('todo')}>
              Todo
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c.id}
                className="chip"
                aria-pressed={active === c.id}
                onClick={() => choose(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="search">
            <Search strokeWidth={1.75} />
            <label htmlFor="menu-search" className="sr-only">
              Buscar en el menú
            </label>
            <input
              id="menu-search"
              type="search"
              placeholder="Buscá: queso, tocino, pizza…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Borrar búsqueda">
                <X strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        <div id="menu-list" style={{ scrollMarginTop: 'calc(var(--header-h) + 140px)' }} aria-live="polite">
          {groups.length === 0 && (
            <div className="empty">
              <span className="accent">Uh, no encontramos eso</span>
              Probá con otra palabra o mirá todo el menú.
            </div>
          )}
          {groups.map(({ category, items }) => (
            <div className="menu-group" key={category.id}>
              <h3 className="display menu-group__title">
                {category.name}
                <small>
                  {items.length} {items.length === 1 ? 'opción' : 'opciones'}
                </small>
              </h3>
              <div className="grid">
                {items.map((p, i) => (
                  <Reveal key={p.id} index={i}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
