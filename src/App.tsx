import { lazy, Suspense, useEffect, useState } from 'react'
import { About } from './components/About'
import { Divider } from './components/Divider'
import { Floating } from './components/Floating'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HoursLocation } from './components/HoursLocation'
import { HowToOrder } from './components/HowToOrder'
import { Marquee } from './components/Marquee'
import { MenuSection } from './components/MenuSection'
import { StarSection } from './components/StarSection'
import { StoreProvider } from './store'

// el modal y el carrito no hacen falta para el primer render
const ProductModal = lazy(() => import('./components/ProductModal').then((m) => ({ default: m.ProductModal })))
const CartDrawer = lazy(() => import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer })))

export default function App() {
  // se montan solo en el cliente: el prerender no los necesita
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <StoreProvider>
      <a className="skip-link" href="#menu">
        Saltar al menú
      </a>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <StarSection />
        <MenuSection />
        <HowToOrder />
        <About />
        <Divider />
        <Gallery />
        <HoursLocation />
      </main>
      <Footer />
      <Floating />
      {mounted && (
        <Suspense fallback={null}>
          <ProductModal />
          <CartDrawer />
        </Suspense>
      )}
    </StoreProvider>
  )
}
