import { ClipboardList, Hand, Send } from 'lucide-react'
import { Reveal } from './Reveal'

const steps = [
  {
    icon: Hand,
    title: 'Elegí',
    text: 'Mirá el menú y tocá lo que se te antoje. Sumá agregados o sacale lo que no va.',
  },
  {
    icon: ClipboardList,
    title: 'Armá tu pedido',
    text: 'Revisá el carrito, decinos si es delivery o retiro y cómo pagás.',
  },
  {
    icon: Send,
    title: 'Mandalo por WhatsApp',
    text: 'Te llega armadito a nuestro WhatsApp. Lo confirmamos y al horno.',
  },
]

export function HowToOrder() {
  return (
    <section className="section" id="como-pedir" aria-labelledby="how-title">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Fácil, rápido y sin vueltas</span>
          <h2 className="display h2" id="how-title">
            Cómo pedir
          </h2>
        </Reveal>
        <ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal index={i} className="step">
                <span className="step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="step__icon">
                  <s.icon strokeWidth={1.75} />
                </div>
                <h3>
                  <span className="sr-only">Paso {i + 1}: </span>
                  {s.title}
                </h3>
                <p>{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
