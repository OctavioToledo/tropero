import { images, type ImageInfo } from './images'

export type CategoryId = 'envueltitos' | 'pizzas' | 'hamburguesas' | 'lomos' | 'bebidas'
export type Badge = 'Estrella' | 'Nuevo' | 'Picante' | 'Veggie'

export interface Category {
  id: CategoryId
  name: string
}

export interface Option {
  id: string
  name: string
  /** precio adicional (puede ser negativo, ej. media pizza) */
  price: number
}

export interface OptionGroup {
  id: string
  name: string
  /** single = elegís una; multiple = varias (hasta `max`) */
  type: 'single' | 'multiple'
  required: boolean
  max?: number
  options: Option[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: CategoryId
  image?: ImageInfo
  /** rellenos que se muestran como chips (envueltitos) */
  fillings?: string[]
  badges?: Badge[]
  available: boolean
  featured?: boolean
  optionGroups?: OptionGroup[]
}

export const categories: Category[] = [
  { id: 'envueltitos', name: 'Envueltitos' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'hamburguesas', name: 'Hamburguesas' },
  { id: 'lomos', name: 'Lomos' },
  { id: 'bebidas', name: 'Bebidas' },
]

// ---------- Grupos de opciones reutilizables ----------

const agregados: OptionGroup = {
  id: 'agregados',
  name: 'Agregados',
  type: 'multiple',
  required: false,
  max: 3,
  options: [
    { id: 'queso-extra', name: 'Queso extra', price: 1200 }, // TODO: confirmar con cliente
    { id: 'tocino', name: 'Tocino', price: 1500 }, // TODO: confirmar con cliente
    { id: 'huevo', name: 'Huevo', price: 900 }, // TODO: confirmar con cliente
    { id: 'cheddar', name: 'Cheddar', price: 1200 }, // TODO: confirmar con cliente
  ],
}

/** "Sacale…" se arma a partir de los rellenos del envueltito */
const sacale = (fillings: string[]): OptionGroup => ({
  id: 'sacale',
  name: 'Sacale…',
  type: 'multiple',
  required: false,
  options: fillings.map((f) => ({ id: `sin-${slug(f)}`, name: `Sin ${f.toLowerCase()}`, price: 0 })),
})

const tamanoPizza = (price: number): OptionGroup => ({
  id: 'tamano',
  name: 'Tamaño',
  type: 'single',
  required: true,
  options: [
    { id: 'entera', name: 'Entera', price: 0 },
    { id: 'media', name: 'Media', price: -Math.round((price * 0.45) / 100) * 100 }, // TODO: confirmar con cliente
  ],
})

const combo: OptionGroup = {
  id: 'combo',
  name: 'Hacelo combo con papas',
  type: 'single',
  required: false,
  options: [
    { id: 'papas', name: 'Con papas fritas', price: 2800 }, // TODO: confirmar con cliente
    { id: 'papas-bebida', name: 'Con papas + bebida 500ml', price: 4500 }, // TODO: confirmar con cliente
  ],
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
}

function envueltito(p: Omit<Product, 'category' | 'optionGroups' | 'available'> & { available?: boolean }): Product {
  return {
    available: true,
    ...p,
    category: 'envueltitos',
    optionGroups: [agregados, sacale(p.fillings ?? [])],
  }
}

// ---------- Productos ----------
// TODO: confirmar con cliente — todos los nombres, descripciones y precios son de demo.

export const products: Product[] = [
  // Envueltitos
  envueltito({
    id: 'env-tropero',
    name: 'El Tropero',
    description: 'El de la casa. Carne cortada a cuchillo, jamón cocido y mucho queso que se estira.', // TODO: confirmar con cliente
    price: 11500, // TODO: confirmar con cliente
    image: images.envueltitoTropero,
    fillings: ['Carne', 'Jamón', 'Queso'],
    badges: ['Estrella'],
    featured: true,
  }),
  envueltito({
    id: 'env-carne',
    name: 'Envueltito de carne',
    description: 'Carne jugosa, morrón asado, cebolla y queso. Masa dorada al horno.', // TODO: confirmar con cliente
    price: 10500, // TODO: confirmar con cliente
    image: images.envueltitoCarne,
    fillings: ['Carne', 'Queso', 'Morrón', 'Cebolla'],
    featured: true,
  }),
  envueltito({
    id: 'env-completo',
    name: 'El Completo',
    description: 'Carne, jamón, tocino crocante, aceitunas y doble queso. Para los que vienen con hambre.', // TODO: confirmar con cliente
    price: 12900, // TODO: confirmar con cliente
    image: images.envueltitoCompleto,
    fillings: ['Carne', 'Queso', 'Tocino', 'Aceitunas'],
    featured: true,
  }),
  envueltito({
    id: 'env-salchichero',
    name: 'El Salchichero',
    description: 'Salchicha, jamón, queso y un toque de mostaza. El preferido de los chicos (y no tanto).', // TODO: confirmar con cliente
    price: 9500, // TODO: confirmar con cliente
    image: images.envueltitoSalchicha,
    fillings: ['Salchicha', 'Jamón', 'Queso'],
    featured: true,
  }),
  envueltito({
    id: 'env-jyq',
    name: 'Jamón y queso',
    description: 'El clásico que nunca falla: jamón cocido y queso tybo bien derretido.', // TODO: confirmar con cliente
    price: 8900, // TODO: confirmar con cliente
    image: images.envueltitoEntero,
    fillings: ['Jamón', 'Queso'],
    featured: true,
  }),
  envueltito({
    id: 'env-pollo',
    name: 'Pollo al verdeo',
    description: 'Pollo desmechado con salsa de verdeo, cebolla caramelizada y queso.', // TODO: confirmar con cliente
    price: 10200, // TODO: confirmar con cliente
    fillings: ['Pollo', 'Verdeo', 'Cebolla', 'Queso'],
    featured: true,
  }),
  envueltito({
    id: 'env-picante',
    name: 'El Picante',
    description: 'Carne, cheddar, jalapeños y salsa de ají de la casa. Avisado estás.', // TODO: confirmar con cliente
    price: 11200, // TODO: confirmar con cliente
    fillings: ['Carne', 'Cheddar', 'Jalapeños'],
    badges: ['Picante', 'Nuevo'],
    featured: true,
  }),
  envueltito({
    id: 'env-veggie',
    name: 'Huerta',
    description: 'Verduras grilladas, choclo, aceitunas y muzzarella. Sin carne, con todo el sabor.', // TODO: confirmar con cliente
    price: 9800, // TODO: confirmar con cliente
    fillings: ['Berenjena', 'Zucchini', 'Choclo', 'Aceitunas', 'Queso'],
    badges: ['Veggie'],
    featured: true,
  }),

  // Pizzas
  {
    id: 'pz-especial',
    name: 'Pizza especial',
    description: 'Muzzarella, morrones asados, aceitunas y orégano.', // TODO: confirmar con cliente
    price: 14500, // TODO: confirmar con cliente
    category: 'pizzas',
    image: images.pizzaMorrones,
    badges: ['Estrella'],
    available: true,
    optionGroups: [tamanoPizza(14500)],
  },
  {
    id: 'pz-roquefort',
    name: 'Pizza roquefort',
    description: 'Muzzarella y roquefort gratinado. Intensa como tiene que ser.', // TODO: confirmar con cliente
    price: 15500, // TODO: confirmar con cliente
    category: 'pizzas',
    image: images.pizzaRoquefort,
    available: true,
    optionGroups: [tamanoPizza(15500)],
  },
  {
    id: 'pz-muzza',
    name: 'Pizza muzzarella',
    description: 'Salsa de tomate casera, muzzarella y aceitunas.', // TODO: confirmar con cliente
    price: 12000, // TODO: confirmar con cliente
    category: 'pizzas',
    badges: ['Veggie'],
    available: true,
    optionGroups: [tamanoPizza(12000)],
  },
  {
    id: 'pz-fugazzeta',
    name: 'Fugazzeta',
    description: 'Muzzarella y mucha cebolla dorada. La de siempre.', // TODO: confirmar con cliente
    price: 13500, // TODO: confirmar con cliente
    category: 'pizzas',
    available: false,
    optionGroups: [tamanoPizza(13500)],
  },

  // Hamburguesas
  {
    id: 'hb-tropera',
    name: 'La Tropera',
    description: 'Doble medallón, doble cheddar, tocino y aros de cebolla crocantes. Salsa barbacoa.', // TODO: confirmar con cliente
    price: 13900, // TODO: confirmar con cliente
    category: 'hamburguesas',
    image: images.hamburguesaAros,
    badges: ['Estrella'],
    available: true,
    optionGroups: [combo],
  },
  {
    id: 'hb-huevo',
    name: 'Completa con huevo',
    description: 'Doble medallón, cheddar, huevo a la plancha, lechuga y tomate.', // TODO: confirmar con cliente
    price: 12900, // TODO: confirmar con cliente
    category: 'hamburguesas',
    image: images.hamburguesaHuevo,
    available: true,
    optionGroups: [combo],
  },
  {
    id: 'hb-desmechada',
    name: 'Desmechada',
    description: 'Cerdo desmechado a la barbacoa, cheddar y coleslaw cremoso.', // TODO: confirmar con cliente
    price: 13500, // TODO: confirmar con cliente
    category: 'hamburguesas',
    image: images.hamburguesaDesmechada,
    badges: ['Nuevo'],
    available: true,
    optionGroups: [combo],
  },
  {
    id: 'hb-clasica',
    name: 'Clásica',
    description: 'Medallón simple, queso, lechuga, tomate y mayonesa de la casa.', // TODO: confirmar con cliente
    price: 9900, // TODO: confirmar con cliente
    category: 'hamburguesas',
    available: true,
    optionGroups: [combo],
  },

  // Lomos
  {
    id: 'lm-completo',
    name: 'Lomo completo con palta',
    description: 'Lomo a la plancha, jamón, queso, tomate, palta y salsa de morrones.', // TODO: confirmar con cliente
    price: 16500, // TODO: confirmar con cliente
    category: 'lomos',
    image: images.lomo,
    badges: ['Estrella'],
    available: true,
    optionGroups: [combo],
  },
  {
    id: 'lm-clasico',
    name: 'Lomo clásico',
    description: 'Lomo, lechuga, tomate, jamón, queso y huevo. El mendocino de toda la vida.', // TODO: confirmar con cliente
    price: 15000, // TODO: confirmar con cliente
    category: 'lomos',
    available: true,
    optionGroups: [combo],
  },
  {
    id: 'lm-pollo',
    name: 'Lomo de pollo',
    description: 'Pechuga grillada, queso, lechuga, tomate y mayonesa de ajo.', // TODO: confirmar con cliente
    price: 13500, // TODO: confirmar con cliente
    category: 'lomos',
    available: true,
    optionGroups: [combo],
  },

  // Bebidas
  {
    id: 'bb-coca',
    name: 'Coca-Cola 1,5 L',
    description: 'Original o Zero. Aclaralo en el pedido.', // TODO: confirmar con cliente
    price: 3800, // TODO: confirmar con cliente
    category: 'bebidas',
    available: true,
  },
  {
    id: 'bb-cerveza',
    name: 'Cerveza lata 473 ml',
    description: 'Rubia bien fría.', // TODO: confirmar con cliente
    price: 3200, // TODO: confirmar con cliente
    category: 'bebidas',
    available: true,
  },
  {
    id: 'bb-limonada',
    name: 'Limonada casera',
    description: 'Con menta y jengibre. Jarra de 1 L.', // TODO: confirmar con cliente
    price: 4200, // TODO: confirmar con cliente
    category: 'bebidas',
    badges: ['Nuevo'],
    available: true,
  },
  {
    id: 'bb-agua',
    name: 'Agua mineral 500 ml',
    description: 'Con o sin gas.', // TODO: confirmar con cliente
    price: 1800, // TODO: confirmar con cliente
    category: 'bebidas',
    available: true,
  },
]
