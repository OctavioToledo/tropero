import { business } from '../data/business'
import { images } from '../data/images'
import { Reveal } from './Reveal'

export function About() {
  const img = images.local
  return (
    <section className="section section--alt" id="nosotros" aria-labelledby="about-title">
      <div className="container about">
        <Reveal className="about__photo">
          <img
            src={`/img/${img.id}-480.webp`}
            srcSet={`/img/${img.id}-480.webp 480w, /img/${img.id}-960.webp ${img.w}w`}
            sizes="(min-width: 900px) 560px, 92vw"
            width={img.w}
            height={img.h}
            alt={img.alt}
            loading="lazy"
          />
          <div className="stamp" aria-label={`Desde ${business.since}`}>
            <div>
              <small>DESDE</small>
              <span>{business.since}</span>
            </div>
          </div>
        </Reveal>
        <Reveal index={1} className="about__text">
          <div className="section-head">
            <span className="eyebrow">Nosotros</span>
            <h2 className="display h2" id="about-title">
              Hecho a mano, desde {business.since}
            </h2>
          </div>
          {business.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
