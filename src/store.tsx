import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { business } from './data/business'
import {
  emptyForm,
  findProduct,
  lineKey,
  unitPrice,
  type CartLine,
  type CheckoutForm,
  type Selections,
} from './lib/cart'
import { load, save } from './lib/storage'

const CART_KEY = 'tropero:cart'
const FORM_KEY = 'tropero:form'

interface Store {
  lines: CartLine[]
  count: number
  subtotal: number
  shipping: number
  form: CheckoutForm
  setForm: (patch: Partial<CheckoutForm>) => void
  add: (productId: string, selections: Selections, note: string, qty: number, origin?: HTMLElement | null) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  productId: string | null
  openProduct: (id: string | null) => void
  toast: { id: number; text: string } | null
  bump: number
}

const Ctx = createContext<Store | null>(null)

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore fuera de StoreProvider')
  return s
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** La miniatura "vuela" desde la foto del producto hasta el ícono del carrito visible */
function flyToCart(origin: HTMLElement) {
  if (reducedMotion()) return
  const img = origin.querySelector('img')
  const target = [...document.querySelectorAll<HTMLElement>('[data-cart-target]')].find((el) => el.offsetParent)
  if (!img || !target) return
  const from = img.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = 64
  const clone = document.createElement('img')
  clone.src = img.currentSrc || img.src
  clone.alt = ''
  clone.className = 'fly'
  Object.assign(clone.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
  })
  document.body.appendChild(clone)
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const anim = clone.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 80}px) scale(0.8)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.4 },
    ],
    { duration: 650, easing: 'cubic-bezier(.5,0,.75,0)' },
  )
  anim.onfinish = () => clone.remove()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [form, setFormState] = useState<CheckoutForm>(emptyForm)
  const [restored, setRestored] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [productId, openProduct] = useState<string | null>(null)
  const [toast, setToast] = useState<Store['toast']>(null)
  const [bump, setBump] = useState(0)
  const toastTimer = useRef<number | undefined>(undefined)

  // El HTML viene prerenderizado: recuperamos lo guardado recién después de hidratar
  useEffect(() => {
    setLines(load<CartLine[]>(CART_KEY, []).filter((l) => findProduct(l.productId)))
    setFormState({ ...emptyForm, ...load(FORM_KEY, {}) })
    setRestored(true)
  }, [])
  useEffect(() => {
    if (restored) save(CART_KEY, lines)
  }, [lines, restored])
  useEffect(() => {
    if (restored) save(FORM_KEY, form)
  }, [form, restored])

  const setForm = useCallback((patch: Partial<CheckoutForm>) => setFormState((f) => ({ ...f, ...patch })), [])

  const add: Store['add'] = useCallback((pid, selections, note, qty, origin) => {
    const key = lineKey(pid, selections, note)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      return [...prev, { key, productId: pid, selections, note: note.trim(), qty }]
    })
    if (origin) flyToCart(origin)
    window.setTimeout(() => setBump((b) => b + 1), reducedMotion() || !origin ? 0 : 600)
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), text: 'Agregado' })
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  const setQty = useCallback(
    (key: string, qty: number) =>
      setLines((prev) =>
        qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
      ),
    [],
  )
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])

  const { count, subtotal } = useMemo(() => {
    let count = 0
    let subtotal = 0
    for (const l of lines) {
      const p = findProduct(l.productId)
      if (!p) continue
      count += l.qty
      subtotal += unitPrice(p, l.selections) * l.qty
    }
    return { count, subtotal }
  }, [lines])

  const shipping = form.mode === 'delivery' ? business.delivery.cost : 0

  const value: Store = {
    lines,
    count,
    subtotal,
    shipping,
    form,
    setForm,
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    productId,
    openProduct,
    toast,
    bump,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
