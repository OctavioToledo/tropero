import { ShoppingBag } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Logo } from './Logo'

const links = [
  { href: '#envueltitos', label: 'Envueltitos' },
  { href: '#menu', label: 'Menú' },
  { href: '#como-pedir', label: 'Cómo pedir' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#horarios', label: 'Horarios' },
]

export function Header() {
  const { count, setCartOpen, bump } = useStore()
  const reduce = useReducedMotion()
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${solid ? ' is-solid' : ''}`}>
      <div className="container header__inner">
        <Logo />
        <nav className="nav" aria-label="Secciones">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="cart-btn"
          onClick={() => setCartOpen(true)}
          aria-label={`Ver pedido, ${count} ${count === 1 ? 'producto' : 'productos'}`}
          data-cart-target
        >
          <ShoppingBag strokeWidth={1.75} />
          <span className="cart-btn__label">Pedido</span>
          <motion.span
            key={bump}
            className="cart-count"
            initial={reduce || bump === 0 ? false : { scale: 1.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          >
            {count}
          </motion.span>
        </button>
      </div>
    </header>
  )
}
