import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { business } from '../data/business'
import { images } from '../data/images'
import { getOpenStatus, type OpenStatus } from '../lib/hours'
import { waQuestionLink } from '../lib/whatsapp'
import { Embers } from './Embers'
import { WhatsAppIcon } from './Icons'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  // se calcula en el cliente (el HTML prerenderizado no sabe la hora)
  const [status, setStatus] = useState<OpenStatus | null>(null)
  const { scrollY } = useScroll()
  const parallax = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 90])

  useEffect(() => {
    setStatus(getOpenStatus())
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const letters = business.name.split('')
  const lettersEnd = 0.15 + letters.length * 0.06 + 0.45
  const img = images.envueltitoCarne

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p
            className={`status${status?.open ? ' is-open' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: status ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="status__dot" aria-hidden="true" />
            {status?.label ?? 'Horarios'}
          </motion.p>

          <h1 className="hero__title" id="hero-title" aria-label={business.name}>
            {letters.map((ch, i) => (
              <span className="hero__letter-mask" key={i} aria-hidden="true">
                <motion.span
                  className="hero__letter"
                  initial={reduce ? { opacity: 0 } : { y: '105%' }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.06, ease }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__slogan accent"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: lettersEnd - 0.25, ease }}
          >
            {business.slogan}
          </motion.p>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: lettersEnd - 0.1 }}
          >
            Masa estirada a mano, rellena hasta el borde y al horno bien caliente. Armá tu pedido acá y te llega directo
            a nuestro WhatsApp.
          </motion.p>

          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: lettersEnd - 0.05, ease }}
          >
            <a className="btn btn--primary" href="#menu">
              Ver el menú
              <ArrowDown strokeWidth={1.75} />
            </a>
            <a className="btn btn--secondary" href={waQuestionLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              <span>
                <span className="only-wide">Pedí por </span>WhatsApp
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero__dish"
          style={{ y: parallax }}
          initial={{ scale: reduce ? 1 : 0.92 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <Embers />
          <motion.div
            className="hero__glow"
            animate={reduce ? undefined : { opacity: [0.75, 1, 0.75], scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero__plate"
            animate={reduce ? undefined : { y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={`/img/${img.id}-480.webp`}
              srcSet={`/img/${img.id}-480.webp 480w, /img/${img.id}-960.webp ${img.w}w`}
              sizes="(min-width: 900px) 520px, 74vw"
              width={img.w}
              height={img.h}
              alt={img.alt}
              fetchPriority="high"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
