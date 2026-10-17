const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

/** $12.500 (sin espacio raro entre el signo y el número) */
export const money = (n: number) => ars.format(n).replace(/\s/g, '')
