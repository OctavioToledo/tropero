import { business } from '../data/business'
import { waQuestionLink } from '../lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './Icons'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />
        <p className="accent" style={{ margin: 0 }}>
          {business.slogan}
        </p>
        <div className="socials">
          <a
            className="icon-btn"
            href={business.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            className="icon-btn"
            href={waQuestionLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>
        <p className="footer__legal" style={{ margin: 0 }}>
          © {business.name} · {business.city}
          <br />
          <a href={business.credit.url} target="_blank" rel="noopener">
            {business.credit.label}
          </a>
        </p>
      </div>
    </footer>
  )
}
