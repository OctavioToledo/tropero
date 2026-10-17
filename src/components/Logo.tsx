import { business } from '../data/business'
import { BrandMark } from './Icons'

export function Logo({ href = '#inicio' }: { href?: string }) {
  return (
    <a className="logo" href={href} aria-label={`${business.name}, ir al inicio`}>
      <BrandMark className="logo__mark" style={{ color: 'var(--brasa)' }} />
      <span className="logo__text">{business.name}</span>
    </a>
  )
}
