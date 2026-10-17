import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useRef } from 'react'
import { images } from '../data/images'
import { products } from '../data/products'
import { money } from '../lib/format'
import { useStore } from '../store'
import { Badges, ProductMedia } from './ProductMedia'
import { Reveal } from './Reveal'

const envueltitos = products.filter((p) => p.category === 'envueltitos' && p.featured)

export function StarSection() {
  const { openProduct } = useStore()
  const track = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.star-card')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' })
  }

  return (
    <section className="section" id="envueltitos" aria-labelledby="star-title">
      <div className="container">
        <div className="star-intro">
          <Reveal className="star-intro__text">
            <div className="section-head">
              <span className="eyebrow">La estrella de la casa</span>
              <h2 className="display h2" id="star-title">
                Los envueltitos
              </h2>
              <p className="accent">tu nuevo antojo favorito</p>
            </div>
            <p>
              <strong>¿Nunca probaste uno?</strong> Imaginate un burrito, pero hecho a nuestra manera: masa casera
              estirada a mano, envolviendo un relleno generoso de carne, queso, tocino, aceitunas… lo que pinte. Va al
              horno hasta que la masa queda dorada y el queso se estira al cortarlo.
            </p>
            <p>Se come con la mano, llena como un plato y viaja perfecto hasta tu casa.</p>
          </Reveal>
          <Reveal index={1}>
            <div className="what-is">
              <img
                src={`/img/${images.envueltitoEntero.id}-480.webp`}
                width={480}
                height={367}
                alt={images.envueltitoEntero.alt}
                loading="lazy"
              />
              <p>
                <span className="accent">Momento envueltito</span>
                Masa casera + relleno a elección + horno caliente. Así de simple, así de rico.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="carousel">
          <div className="carousel__track" ref={track}>
            {envueltitos.map((p, i) => (
              <Reveal key={p.id} index={i}>
                <button
                  type="button"
                  className="star-card has-zoom"
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => openProduct(p.id)}
                  aria-label={`${p.name}, ${money(p.price)}. Ver y agregar`}
                >
                  <div className="star-card__media">
                    <ProductMedia product={p} sizes="(min-width: 600px) 360px, 82vw" />
                    <Badges badges={p.badges} />
                  </div>
                  <div className="star-card__body">
                    <h3 className="star-card__name">{p.name}</h3>
                    <div className="fillings">
                      {p.fillings?.map((f) => (
                        <span className="tag" key={f}>
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="star-card__foot">
                      <span className="price">{money(p.price)}</span>
                      <span className="add-dot" aria-hidden="true">
                        <Plus strokeWidth={2.25} />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          <div className="carousel__controls">
            <button type="button" className="icon-btn" onClick={() => scrollBy(-1)} aria-label="Anteriores">
              <ChevronLeft strokeWidth={1.75} />
            </button>
            <button type="button" className="icon-btn" onClick={() => scrollBy(1)} aria-label="Siguientes">
              <ChevronRight strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
