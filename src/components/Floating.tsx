import { ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { money } from '../lib/format'
import { waQuestionLink } from '../lib/whatsapp'
import { useStore } from '../store'
import { WhatsAppIcon } from './Icons'

export function Floating() {
  const { count, subtotal, setCartOpen, cartOpen, productId, toast } = useStore()
  const reduce = useReducedMotion()
  const showBar = count > 0 && !cartOpen && !productId

  return (
    <>
      <a
        className={`fab-wa${showBar ? ' is-raised' : ''}`}
        href={waQuestionLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultanos por WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      <AnimatePresence>
        {showBar && (
          <motion.button
            type="button"
            className="cart-bar"
            onClick={() => setCartOpen(true)}
            initial={{ y: reduce ? 0 : 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            data-cart-target
          >
            <span className="cart-bar__left">
              <ShoppingBag size={20} strokeWidth={1.75} />
              Ver pedido
              <span className="cart-bar__count">{count}</span>
            </span>
            <span className="cart-bar__total">{money(subtotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: reduce ? 0 : -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: reduce ? 0 : -12, x: '-50%' }}
            transition={{ duration: 0.2 }}
          >
            <Check strokeWidth={2.5} /> {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
