import { business, dayNames, type DayKey, type TimeRange } from '../data/business'

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** fin de la franja en minutos desde el inicio de su día (puede pasar de 1440) */
const endOf = (r: TimeRange) => {
  const from = toMin(r.from)
  const to = toMin(r.to)
  return to <= from ? to + 1440 : to
}

export interface OpenStatus {
  open: boolean
  label: string
}

export function getOpenStatus(now = new Date()): OpenStatus {
  const day = now.getDay() as DayKey
  const yesterday = ((day + 6) % 7) as DayKey
  const m = now.getHours() * 60 + now.getMinutes()
  const hours = business.hours

  for (const r of hours[day]) {
    if (m >= toMin(r.from) && m < endOf(r)) return { open: true, label: `Abierto ahora · hasta ${r.to}` }
  }
  for (const r of hours[yesterday]) {
    if (endOf(r) > 1440 && m + 1440 < endOf(r)) return { open: true, label: `Abierto ahora · hasta ${r.to}` }
  }

  for (let offset = 0; offset < 7; offset++) {
    const d = ((day + offset) % 7) as DayKey
    const next = hours[d].find((r) => offset > 0 || toMin(r.from) > m)
    if (next) {
      const when = offset === 0 ? '' : offset === 1 ? 'mañana ' : `el ${dayNames[d].toLowerCase()} `
      return { open: false, label: `Cerrado · abre ${when}${next.from}` }
    }
  }
  return { open: false, label: 'Cerrado' }
}

export const formatRanges = (ranges: TimeRange[]) =>
  ranges.length ? ranges.map((r) => `${r.from} – ${r.to}`).join(' y ') : 'Cerrado'
