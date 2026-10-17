import {
  AlertTriangle,
  Banknote,
  Bike,
  CheckCircle2,
  Clock,
  Landmark,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { business } from '../data/business'
import { describeSelections, findProduct, lineTitle, unitPrice } from '../lib/cart'
import { money } from '../lib/format'
import { getOpenStatus } from '../lib/hours'
import { buildOrderMessage, waLink } from '../lib/whatsapp'
import { useStore } from '../store'
import { WhatsAppIcon } from './Icons'
import { ProductMedia } from './ProductMedia'
import { Sheet } from './Sheet'

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, count, subtotal, shipping, form, setForm, setQty, remove, clear } = useStore()
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)

  const close = () => {
    setCartOpen(false)
    setSent(false)
  }

  const status = getOpenStatus()
  const minOrder = business.delivery.minOrder
  const belowMin = subtotal < minOrder
  const errors = {
    name: !form.name.trim() ? 'Decinos tu nombre así sabemos de quién es el pedido.' : '',
    address: form.mode === 'delivery' && !form.address.trim() ? 'Necesitamos la dirección para llevártelo.' : '',
  }
  const invalid = !!(errors.name || errors.address)

  const send = () => {
    setTried(true)
    if (invalid || belowMin || !lines.length) {
      const first = document.querySelector<HTMLElement>('.sheet [aria-invalid="true"]')
      first?.focus()
      return
    }
    window.open(waLink(buildOrderMessage(lines, form, subtotal, shipping)), '_blank', 'noopener')
    setSent(true)
  }

  return (
    <Sheet open={cartOpen} onClose={close} label="Tu pedido" desktop="right">
      <div className="cart-head">
        <span className="eyebrow">{count ? `${count} ${count === 1 ? 'producto' : 'productos'}` : 'Vacío'}</span>
        <h2>Tu pedido</h2>
      </div>

      {sent ? (
        <div className="sheet__scroll">
          <div className="sent">
            <CheckCircle2 size={48} strokeWidth={1.75} color="var(--salvia)" />
            <span className="accent">¡Listo, ya casi!</span>
            <p>
              Se abrió WhatsApp con tu pedido armado. Solo falta tocar <strong>enviar</strong>. Te confirmamos por ahí.
            </p>
            <div className="sent__actions">
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => {
                  clear()
                  close()
                }}
              >
                Vaciar carrito
              </button>
              <button type="button" className="btn btn--secondary btn--block" onClick={() => setSent(false)}>
                Volver al pedido
              </button>
            </div>
          </div>
        </div>
      ) : !lines.length ? (
        <div className="sheet__scroll">
          <div className="cart-empty">
            <ShoppingBag strokeWidth={1.75} />
            <span className="accent">Todavía no elegiste nada</span>
            <p style={{ margin: 0 }}>Arrancá por un envueltito, que para eso vinimos.</p>
            <a className="btn btn--primary" href="#envueltitos" onClick={close}>
              Ver envueltitos
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="sheet__scroll">
            <section className="cart-section" aria-label="Productos">
              <ul className="lines">
                {lines.map((l) => {
                  const p = findProduct(l.productId)
                  if (!p) return null
                  const { extras, removals } = describeSelections(p, l.selections)
                  return (
                    <li className="line" key={l.key}>
                      <div className="line__thumb">
                        <ProductMedia product={p} sizes="56px" showName={false} />
                      </div>
                      <div>
                        <div className="line__top">
                          <p className="line__name">{lineTitle(p, l.selections)}</p>
                          <span className="price">{money(unitPrice(p, l.selections) * l.qty)}</span>
                        </div>
                        {extras.length > 0 && <p className="line__meta">{extras.map((e) => `+ ${e}`).join(', ')}</p>}
                        {removals.length > 0 && <p className="line__meta">{removals.join(', ')}</p>}
                        {l.note && <p className="line__meta line__note">“{l.note}”</p>}
                        <div className="line__controls">
                          <div className="stepper stepper--sm" role="group" aria-label={`Cantidad de ${p.name}`}>
                            <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Restar uno">
                              <Minus strokeWidth={2} />
                            </button>
                            <output>{l.qty}</output>
                            <button
                              type="button"
                              onClick={() => setQty(l.key, Math.min(20, l.qty + 1))}
                              aria-label="Sumar uno"
                            >
                              <Plus strokeWidth={2} />
                            </button>
                          </div>
                          <button type="button" className="link-btn" onClick={() => remove(l.key)}>
                            <Trash2 strokeWidth={1.75} /> Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="cart-section" aria-labelledby="datos-title">
              <h3 className="cart-section__title" id="datos-title">
                Tus datos
              </h3>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="f-name">Nombre *</label>
                  <input
                    id="f-name"
                    className="input"
                    autoComplete="given-name"
                    placeholder="¿Cómo te llamás?"
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    aria-invalid={tried && !!errors.name}
                    aria-describedby={tried && errors.name ? 'e-name' : undefined}
                  />
                  {tried && errors.name && (
                    <p className="field__error" id="e-name">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <span className="label" id="mode-label">
                    ¿Cómo lo querés?
                  </span>
                  <div className="segmented" role="radiogroup" aria-labelledby="mode-label">
                    <label>
                      <input
                        type="radio"
                        name="mode"
                        checked={form.mode === 'delivery'}
                        onChange={() => setForm({ mode: 'delivery' })}
                      />
                      <Bike strokeWidth={1.75} /> Delivery
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="mode"
                        checked={form.mode === 'retiro'}
                        onChange={() => setForm({ mode: 'retiro' })}
                      />
                      <Store strokeWidth={1.75} /> Retiro
                    </label>
                  </div>
                </div>

                {form.mode === 'delivery' ? (
                  <>
                    <div className="field">
                      <label htmlFor="f-address">Dirección *</label>
                      <input
                        id="f-address"
                        className="input"
                        autoComplete="street-address"
                        placeholder="Calle, número, depto"
                        value={form.address}
                        onChange={(e) => setForm({ address: e.target.value })}
                        aria-invalid={tried && !!errors.address}
                        aria-describedby={tried && errors.address ? 'e-address' : undefined}
                      />
                      {tried && errors.address && (
                        <p className="field__error" id="e-address">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="f-ref">
                        Referencia <small>(opcional)</small>
                      </label>
                      <input
                        id="f-ref"
                        className="input"
                        placeholder="Ej: portón verde, timbre 2"
                        value={form.reference}
                        onChange={(e) => setForm({ reference: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <p className="line__meta" style={{ margin: 0 }}>
                    Retirás en {business.address}.
                  </p>
                )}

                <div className="field">
                  <span className="label" id="pay-label">
                    ¿Cómo pagás?
                  </span>
                  <div className="segmented" role="radiogroup" aria-labelledby="pay-label">
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        checked={form.payment === 'efectivo'}
                        onChange={() => setForm({ payment: 'efectivo' })}
                      />
                      <Banknote strokeWidth={1.75} /> Efectivo
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        checked={form.payment === 'transferencia'}
                        onChange={() => setForm({ payment: 'transferencia' })}
                      />
                      <Landmark strokeWidth={1.75} /> Transferencia
                    </label>
                  </div>
                </div>

                {form.payment === 'efectivo' ? (
                  <div className="field">
                    <label htmlFor="f-cash">
                      ¿Con cuánto pagás? <small>(para llevarte el vuelto)</small>
                    </label>
                    <input
                      id="f-cash"
                      className="input"
                      inputMode="numeric"
                      placeholder={`Ej: ${money(Math.ceil((subtotal + shipping) / 5000) * 5000)}`}
                      value={form.cashAmount}
                      onChange={(e) => setForm({ cashAmount: e.target.value.replace(/[^\d.$\s]/g, '') })}
                    />
                  </div>
                ) : (
                  <p className="line__meta" style={{ margin: 0 }}>
                    {business.payments.find((p) => p.id === 'transferencia')?.detail}.
                  </p>
                )}

                <div className="field">
                  <label htmlFor="f-comments">
                    Comentarios <small>(opcional)</small>
                  </label>
                  <textarea
                    id="f-comments"
                    className="textarea"
                    placeholder="Algo que tengamos que saber"
                    value={form.comments}
                    onChange={(e) => setForm({ comments: e.target.value })}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="sheet__footer">
            {!status.open && (
              <p className="notice notice--closed">
                <Clock strokeWidth={1.75} />
                <span>
                  <strong>Estamos cerrados</strong> ({status.label.replace('Cerrado · ', '')}). Podés mandarlo igual: lo
                  recibimos cuando abramos.
                </span>
              </p>
            )}
            {belowMin && (
              <p className="notice">
                <AlertTriangle strokeWidth={1.75} />
                <span>
                  El pedido mínimo es de {money(minOrder)}. Te faltan <strong>{money(minOrder - subtotal)}</strong>.
                </span>
              </p>
            )}
            <dl className="totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              {form.mode === 'delivery' && (
                <div>
                  <dt>Envío</dt>
                  <dd>{money(shipping)}</dd>
                </div>
              )}
              <div className="totals__total">
                <dt>Total</dt>
                <dd>{money(subtotal + shipping)}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn--primary btn--block" onClick={send} disabled={belowMin}>
              <WhatsAppIcon /> Enviar pedido por WhatsApp
            </button>
          </div>
        </>
      )}
    </Sheet>
  )
}
