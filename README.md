# Tropero

Landing de TROPERO (Mendoza): catálogo, carrito y pedido que llega armado por WhatsApp.
Vite + React + TypeScript, estático, listo para Vercel. Sistema de diseño en [`DESIGN.md`](./DESIGN.md).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (Vercel lo detecta solo: framework Vite)
```

## Cambiar contenido

Todo el contenido vive en `src/data/`. Buscá `TODO: confirmar con cliente` para ver qué falta validar.

- **Datos del negocio** → `src/data/business.ts`: WhatsApp (formato `549` + característica + número), Instagram,
  dirección, link de Maps, horarios por día, costo de envío, pedido mínimo, zonas y métodos de pago.
- **Productos y categorías** → `src/data/products.ts`. Cada producto tiene `price`, `badges`
  (`Estrella`, `Nuevo`, `Picante`, `Veggie`), `available: false` para mostrarlo como "Hoy no hay" y
  `optionGroups` (único/múltiple, obligatorio, máximo, precio adicional).
- **Imágenes** → poné el archivo en `public/img/` como `<nombre>-480.webp` y `<nombre>-960.webp`, y registralo
  en `src/data/images.ts` con su ancho y alto reales. Si un producto no tiene `image`, se muestra un placeholder.
  La galería se arma con la lista `gallery` del mismo archivo.
- **Colores y tipografías** → variables al principio de `src/styles.css`.
- **Imagen para compartir (Open Graph)** → `public/img/og-tropero.jpg` (1200×630).
