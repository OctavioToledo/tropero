import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  /** en desktop: drawer lateral o modal centrado. En mobile siempre bottom sheet. */
  desktop: 'right' | 'center'
  /** el contenido arma su propio `.sheet__scroll` y `.sheet__footer` */
  children: ReactNode
}

const spring = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 } as const

export function Sheet({ open, onClose, label, desktop, children }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reduce = useReducedMotion()
  const variant = isDesktop ? desktop : 'bottom'
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape, foco y scroll del body
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => panelRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, onClose])

  const motionProps =
    variant === 'bottom'
      ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
      : variant === 'right'
        ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
        : {
            initial: { opacity: 0, scale: 0.94, x: '-50%', y: '-46%' },
            animate: { opacity: 1, scale: 1, x: '-50%', y: '-50%' },
            exit: { opacity: 0, scale: 0.96, x: '-50%', y: '-48%' },
          }
  const reducedProps = reduce
    ? {
        initial: { ...motionProps.animate, opacity: 0 },
        animate: { ...motionProps.animate, opacity: 1 },
        exit: { ...motionProps.animate, opacity: 0 },
      }
    : motionProps

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={`sheet sheet--${variant}`}
            transition={reduce ? { duration: 0.2 } : spring}
            {...reducedProps}
          >
            {variant === 'bottom' && <div className="sheet__grab" aria-hidden="true" />}
            <button type="button" className="icon-btn sheet__close" onClick={onClose} aria-label="Cerrar">
              <X strokeWidth={1.75} />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
