import { categories } from '../data/products'

/** Cinta infinita: dos mitades idénticas que se desplazan -50% en loop */
export function Marquee() {
  const half = (hidden: boolean) => (
    <div className="marquee__half" aria-hidden={hidden || undefined}>
      {[0, 1].flatMap((rep) =>
        categories.map((c) => (
          <span className="marquee__item" key={`${rep}-${c.id}`}>
            {c.name.toUpperCase()}
            <span aria-hidden="true">✦</span>
          </span>
        )),
      )}
    </div>
  )
  return (
    <div className="marquee">
      <div className="marquee__track">
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}
