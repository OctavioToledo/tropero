import { useEffect, useState } from 'react'
import { Bike, Clock, MapPin, Navigation, Wallet } from 'lucide-react'
import { business, dayNames, type DayKey } from '../data/business'
import { money } from '../lib/format'
import { formatRanges } from '../lib/hours'
import { Reveal } from './Reveal'

// Semana arrancando el lunes
const order: DayKey[] = [1, 2, 3, 4, 5, 6, 0]

export function HoursLocation() {
  const [today, setToday] = useState(-1)
  useEffect(() => setToday(new Date().getDay()), [])
  return (
    <section className="section section--alt" id="horarios" aria-labelledby="hours-title">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Vení o te lo llevamos</span>
          <h2 className="display h2" id="hours-title">
            Horarios y ubicación
          </h2>
        </Reveal>
        <div className="info">
          <Reveal className="panel">
            <h3>
              <Clock strokeWidth={1.75} /> Horarios
            </h3>
            <table className="hours">
              <caption className="sr-only">Horarios de atención por día</caption>
              <tbody>
                {order.map((d) => (
                  <tr key={d} className={d === today ? 'is-today' : undefined}>
                    <th scope="row">{dayNames[d]}</th>
                    <td>{formatRanges(business.hours[d])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal index={1} className="panel">
            <h3>
              <MapPin strokeWidth={1.75} /> Dónde estamos
            </h3>
            <ul className="info-list">
              <li>
                <MapPin strokeWidth={1.75} />
                <span>
                  <strong>{business.address}</strong>
                </span>
              </li>
              <li>
                <Bike strokeWidth={1.75} />
                <span>
                  <strong>Delivery {money(business.delivery.cost)}</strong> · llega en {business.delivery.eta}
                  <span className="zones">
                    {business.delivery.zones.map((z) => (
                      <span className="tag" key={z}>
                        {z}
                      </span>
                    ))}
                  </span>
                </span>
              </li>
              <li>
                <Wallet strokeWidth={1.75} />
                <span>
                  Pedido mínimo <strong>{money(business.delivery.minOrder)}</strong> ·{' '}
                  {business.payments.map((p) => p.label).join(' o ')}
                </span>
              </li>
            </ul>
            <a className="btn btn--primary" href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation strokeWidth={1.75} /> Cómo llegar
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
