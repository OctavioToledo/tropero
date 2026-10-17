// Fotos procesadas en /public/img. Cada una existe en dos tamaños: `<id>-480.webp` y `<id>-960.webp`
// (el "960" puede ser más chico si la original no daba para más: por eso guardamos el ancho real).

export interface ImageInfo {
  id: string
  alt: string
  /** ancho real del archivo -960 */
  w: number
  h: number
}

const img = (id: string, alt: string, w: number, h: number): ImageInfo => ({ id, alt, w, h })

export const images = {
  envueltitoCarne: img(
    'envueltito-carne',
    'Envueltito de carne cortado al medio, con queso derretido y morrón',
    849,
    849,
  ),
  envueltitoSalchicha: img(
    'envueltito-salchicha',
    'Envueltito relleno de salchicha y queso, cortado al medio',
    828,
    843,
  ),
  envueltitoCompleto: img(
    'envueltito-completo-detalle',
    'Primer plano de envueltito con jamón, carne y queso derretido',
    828,
    843,
  ),
  envueltitoTropero: img(
    'envueltito-tropero-pila',
    'Pila de envueltitos con jamón, carne y queso chorreando',
    812,
    843,
  ),
  envueltitoEntero: img(
    'envueltito-entero-hero',
    'Envueltito entero recién salido del horno sobre tabla de madera',
    652,
    498,
  ),
  hamburguesaAros: img('hamburguesa-aros-tocino', 'Hamburguesa doble con cheddar, tocino y aros de cebolla', 828, 843),
  hamburguesaHuevo: img(
    'hamburguesa-huevo-cheddar',
    'Hamburguesa doble con huevo, cheddar, lechuga y tomate',
    825,
    850,
  ),
  hamburguesaDesmechada: img('hamburguesa-desmechada', 'Hamburguesa de carne desmechada con cheddar y salsa', 652, 566),
  pizzaMorrones: img('pizza-especial-morrones', 'Pizza con muzzarella, morrones asados y aceitunas', 627, 841),
  pizzaRoquefort: img('pizza-roquefort', 'Pizza de roquefort en su caja', 652, 678),
  lomo: img('lomo-completo-palta', 'Lomo completo con palta, jamón, queso y tomate', 652, 493),
  local: img('local-fachada', 'Fachada del local de TROPERO al atardecer', 666, 520),
} satisfies Record<string, ImageInfo>

/** Fotos para la galería (cuadradas, 600px, versión original con branding). */
export const gallery = [
  { src: '/img/galeria-envueltito-tropero-pila.webp', alt: images.envueltitoTropero.alt },
  { src: '/img/galeria-hamburguesa-aros-tocino.webp', alt: images.hamburguesaAros.alt },
  { src: '/img/galeria-envueltito-entero-hero.webp', alt: 'Envueltito entero con el sticker "Momento envueltito"' },
  { src: '/img/galeria-pizza-especial-morrones.webp', alt: images.pizzaMorrones.alt },
  { src: '/img/galeria-local-fachada.webp', alt: images.local.alt },
  { src: '/img/galeria-envueltito-carne.webp', alt: images.envueltitoCarne.alt },
  { src: '/img/galeria-lomo-completo-palta.webp', alt: images.lomo.alt },
  { src: '/img/galeria-hamburguesa-desmechada.webp', alt: images.hamburguesaDesmechada.alt },
  { src: '/img/galeria-envueltito-completo-detalle.webp', alt: images.envueltitoCompleto.alt },
  { src: '/img/galeria-pizza-roquefort.webp', alt: images.pizzaRoquefort.alt },
  { src: '/img/galeria-hamburguesa-huevo-cheddar.webp', alt: images.hamburguesaHuevo.alt },
  { src: '/img/galeria-envueltito-salchicha.webp', alt: images.envueltitoSalchicha.alt },
]
