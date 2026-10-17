// Datos del negocio. Todo lo que cambia de cliente a cliente vive acá.

export type DayKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo (como Date.getDay())

/** Franjas horarias "HH:MM". Si `to` es menor que `from`, cierra pasada la medianoche. */
export interface TimeRange {
  from: string
  to: string
}

export interface PaymentMethod {
  id: 'efectivo' | 'transferencia'
  label: string
  detail?: string
}

export const business = {
  name: 'TROPERO',
  slogan: 'envueltitos y algo más',
  since: 2013,
  city: 'Mendoza',

  // TODO: confirmar con cliente — número real en formato 549 + característica + número, sin espacios ni signos
  whatsapp: '5492610000000',
  instagram: {
    handle: 'tropero', // TODO: confirmar con cliente
    url: 'https://www.instagram.com/tropero', // TODO: confirmar con cliente
  },

  address: 'Calle Falsa 123, Godoy Cruz, Mendoza', // TODO: confirmar con cliente
  mapsUrl: 'https://maps.google.com/?q=Godoy+Cruz,+Mendoza', // TODO: confirmar con cliente

  // TODO: confirmar con cliente — horarios por día
  hours: {
    0: [{ from: '20:00', to: '00:30' }],
    1: [],
    2: [{ from: '20:00', to: '00:00' }],
    3: [{ from: '20:00', to: '00:00' }],
    4: [{ from: '20:00', to: '00:00' }],
    5: [{ from: '20:00', to: '01:00' }],
    6: [
      { from: '12:00', to: '15:00' },
      { from: '20:00', to: '01:00' },
    ],
  } as Record<DayKey, TimeRange[]>,

  delivery: {
    cost: 1500, // TODO: confirmar con cliente
    minOrder: 8000, // TODO: confirmar con cliente
    zones: ['Godoy Cruz', 'Ciudad de Mendoza', 'Las Heras (zona sur)', 'Luján (Chacras)'], // TODO: confirmar con cliente
    eta: '30–45 min', // TODO: confirmar con cliente
  },

  payments: [
    { id: 'efectivo', label: 'Efectivo' },
    { id: 'transferencia', label: 'Transferencia', detail: 'Te pasamos el alias por WhatsApp' },
  ] as PaymentMethod[],

  // TODO: confirmar con cliente — historia real
  story: [
    'TROPERO no nació de un día para otro. Nació de una idea, mucho trabajo y las ganas de crear algo diferente.',
    'Desde 2013 estiramos la masa todos los días, la rellenamos hasta que no entra más nada y la mandamos al horno bien caliente. Así nació el envueltito: lo que comería un tropero después de un día largo, pero en Mendoza y a la vuelta de tu casa.',
  ],

  credit: { label: 'Sitio por Octavio Toledo', url: 'https://octavio-toledo.vercel.app' },
}

export const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
