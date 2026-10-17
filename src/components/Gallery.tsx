import { business } from '../data/business'
import { gallery } from '../data/images'
import { InstagramIcon } from './Icons'
import { Reveal } from './Reveal'

export function Gallery() {
  return (
    <section className="section" id="galeria" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">@{business.instagram.handle}</span>
          <h2 className="display h2" id="gallery-title">
            Para abrir el apetito
          </h2>
        </Reveal>
        <div className="gallery">
          {gallery.map((g) => (
            <a key={g.src} href={business.instagram.url} target="_blank" rel="noopener noreferrer">
              <img src={g.src} alt={g.alt} width={600} height={600} loading="lazy" decoding="async" />
            </a>
          ))}
        </div>
        <div className="gallery-cta">
          <a className="btn btn--secondary" href={business.instagram.url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon /> Seguinos en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
