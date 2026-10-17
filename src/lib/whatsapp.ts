import { business } from '../data/business'
import { describeSelections, findProduct, lineTitle, unitPrice, type CartLine, type CheckoutForm } from './cart'
import { money } from './format'

export const waLink = (text: string) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`

export const waQuestionLink = () => waLink(`¡Hola ${business.name}! Quería hacerles una consulta 🙂`)

export function buildOrderMessage(lines: CartLine[], form: CheckoutForm, subtotal: number, shipping: number) {
  const out: string[] = []
  out.push(`🔥 *Nuevo pedido — ${business.name}*`, '')
  out.push(`*Cliente:* ${form.name.trim()}`)
  out.push(`*Entrega:* ${form.mode === 'delivery' ? 'Delivery' : 'Retiro en el local'}`)
  if (form.mode === 'delivery') {
    const ref = form.reference.trim() ? ` (ref: ${form.reference.trim()})` : ''
    out.push(`*Dirección:* ${form.address.trim()}${ref}`)
  }
  out.push('', '*Pedido:*')

  for (const line of lines) {
    const product = findProduct(line.productId)
    if (!product) continue
    const { extras, removals } = describeSelections(product, line.selections)
    const total = unitPrice(product, line.selections) * line.qty
    out.push(`${line.qty}x ${lineTitle(product, line.selections)} — ${money(total)}`)
    if (extras.length) out.push(`   ${extras.map((e) => `+ ${e}`).join(', ')}`)
    if (removals.length) out.push(`   ${removals.join(', ')}`)
    if (line.note.trim()) out.push(`   _Nota: ${line.note.trim()}_`)
  }

  out.push('', `Subtotal: ${money(subtotal)}`)
  if (form.mode === 'delivery') out.push(`Envío: ${money(shipping)}`)
  out.push(`*TOTAL: ${money(subtotal + shipping)}*`, '')

  if (form.payment === 'efectivo') {
    const cash = Number(form.cashAmount.replace(/\D/g, ''))
    out.push(`*Pago:* Efectivo${cash ? ` (paga con ${money(cash)})` : ''}`)
  } else {
    out.push('*Pago:* Transferencia')
  }
  if (form.comments.trim()) out.push(`*Comentarios:* ${form.comments.trim()}`)

  return out.join('\n')
}
