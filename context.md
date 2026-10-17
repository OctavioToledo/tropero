# Proyecto: Landing de TROPERO — catálogo, carrito y pedido por WhatsApp

## Contexto
TROPERO es un local de comidas de Mendoza. Slogan: "envueltitos y algo más".
Hoy usan un Linktree que lleva al catálogo de WhatsApp. Vamos a reemplazarlo con una
landing propia: catálogo, carrito y pedido que llega armado a su WhatsApp.
Es una DEMO para mostrarle al cliente: tiene que impactar al abrirla en el celular,
pero ser simple e intuitiva para pedir. También queda como modelo reutilizable, así
que todo el contenido va en archivos de datos, no hardcodeado.

Producto estrella: los **envueltitos** (parecidos a un burrito: masa envolviendo
rellenos como carne, queso, tocino, aceitunas, etc.). También hacen pizzas,
hamburguesas, lomos y bebidas. Los envueltitos son el protagonista visual del sitio.

## Paso 0: Antes de codear
1. Revisá la carpeta de imágenes que te pasé. Listá qué hay (logo, platos, local,
   ambiente) y renombralas de forma descriptiva en `/public/img/`. Convertí a webp
   y generá tamaños razonables. Elegí la mejor foto de un envueltito para el hero.
2. Escribí `DESIGN.md` con el sistema de diseño de abajo, para que quede documentado.
3. Si falta alguna imagen para un producto, usá un placeholder elegante (bloque con
   textura y el nombre del plato), nunca hotlinks externos.

## Stack
- Si ya hay proyecto inicializado, usá ese. Si no: Vite + React + TypeScript.
- Animaciones con `motion` (Framer Motion) o CSS puro. Sin librerías de UI.
- Estático, deploy en Vercel, sin backend.

## Sistema de diseño

### Concepto
"Fogón de tropero": noche, brasa, cuero, madera. Oscuro, cálido, con textura.
Contundente en titulares, limpio y aireado en la lectura.

### Paleta (variables CSS en :root)
--carbon:      #14110F   /* fondo principal */
--tierra:      #1D1814   /* fondo de secciones alternas */
--cuero:       #2A221C   /* tarjetas, modales, drawer */
--cuero-borde: #3A2F26   /* bordes y divisores */
--brasa:       #E8722C   /* acento principal: CTAs, precios, activo */
--brasa-hover: #F2873F
--ocre:        #D9A441   /* acento secundario: badges, detalles, íconos */
--crema:       #F3E9DA   /* texto principal */
--arena:       #B5A592   /* texto secundario */
--salvia:      #8A9A5B   /* estado "Abierto", éxito */
--rojo-seco:   #B4432F   /* errores, "Cerrado", "Picante" */

Nunca negro puro ni blanco puro. Contraste de texto mínimo AA.

### Tipografía (Google Fonts, con fallbacks)
- Display: **Anton**, mayúsculas, tracking levemente abierto. Para hero, títulos de
  sección y nombre de categorías.
- Acento: **Fraunces** itálica, peso 400–500. Para "envueltitos y algo más",
  subtítulos emocionales y frases destacadas.
- Texto y UI: **Manrope** 400/500/700. Precios en Manrope 700 con
  `font-variant-numeric: tabular-nums`.
- Escala fluida con clamp(): hero entre 3.5rem y 8rem; H2 entre 2.25rem y 4rem.

### Texturas y detalles
- Overlay global de grano/ruido muy sutil (SVG noise, opacidad ~4%).
- Viñeta radial cálida detrás de las fotos de producto (glow naranja muy suave,
  como luz de fogón).
- Divisores tipo "costura de cuero" (línea punteada en --cuero-borde) o una marca
  de hierro simple (ícono/monograma "T") entre secciones.
- Radios: 16px tarjetas, 999px botones y chips. Sombras cálidas, no grises.
- Íconos: lucide, trazo 1.75, color ocre.

### Botones
- Primario: fondo --brasa, texto --carbon, Manrope 700, mayúsculas, alto 52px.
  Hover: --brasa-hover y leve elevación. Active: escala 0.97.
- Secundario: borde 1.5px --crema 30%, texto crema, hover borde brasa.
- Chips de categoría: fondo --cuero, activo con fondo --brasa y texto carbón.

### Animaciones (impactantes pero breves y con propósito)
- **Hero**: entrada escalonada — "TROPERO" revela letra por letra desde abajo
  (máscara), luego la cursiva "envueltitos y algo más", luego CTAs. Total < 1.4s.
- **Brasas**: partículas de chispas subiendo lentamente detrás del envueltito del
  hero (canvas liviano, ~30 partículas, se pausa fuera de viewport).
- **Plato del hero**: flota suavemente (translateY ±8px, 6s loop) con glow brasa
  que respira. Leve parallax al scrollear.
- **Marquee**: cinta infinita bajo el hero:
  "ENVUELTITOS ✦ PIZZAS ✦ HAMBURGUESAS ✦ LOMOS ✦ BEBIDAS ✦" en Anton, ocre.
- **Scroll reveal**: secciones y tarjetas aparecen con fade + subida de 24px,
  escalonadas 60ms (IntersectionObserver, una sola vez).
- **Agregar al carrito**: la miniatura del producto "vuela" hacia el ícono del
  carrito; el contador hace bounce; toast breve "Agregado ✓".
- **Tarjetas**: en hover/tap la foto hace zoom 1.05 y el precio se ilumina.
- **Modales y drawer**: spring suave, backdrop con blur.
- Respetar `prefers-reduced-motion`: desactivar partículas, parallax, marquee y
  vuelos; dejar solo fades.
- Nada de animación que bloquee la interacción o retrase ver el menú.

## Arquitectura de datos
- `src/data/business.ts`: nombre, slogan, logo, WhatsApp (formato 549XXXXXXXXXX,
  dejá placeholder con TODO), Instagram, dirección, link a Maps, horarios por día,
  costo de envío, zonas de delivery, pedido mínimo, métodos de pago.
- `src/data/products.ts`: categorías y productos (id, nombre, descripción, precio,
  imagen, categoría, badges opcionales: "Estrella", "Nuevo", "Picante", "Veggie";
  disponible; destacado; grupos de opciones).
- Grupos de opciones: único/múltiple, obligatorio, máximo, precio adicional.
  Ejemplos: envueltitos → "Agregados" (queso extra, tocino, huevo) y "Sacale…";
  pizzas → "Tamaño" (entera / media); hamburguesas y lomos → "Hacelo combo con papas".
- Categorías en este orden: Envueltitos, Pizzas, Hamburguesas, Lomos, Bebidas.
- Cargá datos de demo realistas (6+ envueltitos con rellenos variados, 3–4 de cada
  otra categoría). Marcá todo precio y descripción con `// TODO: confirmar con cliente`.

## Secciones (en orden)
1. **Header** fijo y translúcido (blur) que se solidifica al scrollear: logo,
   anclas, carrito con contador.
2. **Hero** a pantalla completa: "TROPERO" gigante, "envueltitos y algo más" en
   Fraunces itálica, indicador "Abierto ahora / Cerrado · abre HH:MM" calculado por
   horario, CTAs "Ver el menú" y "Pedí por WhatsApp", foto del envueltito con
   brasas. En mobile: texto arriba, plato abajo, todo visible sin scrollear.
3. **Marquee** de categorías.
4. **"La estrella de la casa: los envueltitos"**: sección protagonista con
   explicación corta de qué es un envueltito (para quien no lo conoce) y carrusel
   horizontal con snap de los envueltitos, tarjetas grandes con foto destacada y
   rellenos como chips (carne · queso · tocino · aceitunas).
5. **"Y algo más"**: título con juego del slogan; el menú completo con chips de
   categoría sticky, buscador y grilla de tarjetas (1 col mobile, 2 tablet, 3–4
   desktop). No disponibles: atenuados con "Hoy no hay".
6. **Modal de producto** (bottom sheet en mobile): foto grande, descripción,
   opciones, aclaraciones, cantidad y botón "Agregar · $TOTAL" que recalcula en vivo.
7. **Cómo pedir**: 3 pasos con íconos (Elegí → Armá tu pedido → Mandalo por
   WhatsApp), numerados en Anton gigante en ocre translúcido.
8. **Nosotros**: historia breve (placeholder) con foto del local/ambiente.
9. **Galería**: grilla tipo Instagram con las fotos de la carpeta + botón
   "Seguinos en Instagram".
10. **Horarios y ubicación**: tabla de horarios con el día actual resaltado,
    dirección, botón "Cómo llegar", zonas de delivery.
11. **Footer**: logo, redes, crédito discreto "Sitio por Octavio Toledo" →
    octavio-toledo.vercel.app.
12. **Flotantes**: botón de WhatsApp (consulta) y, en mobile, barra inferior
    "Ver pedido · 3 · $XX.XXX" cuando hay items.

## Carrito y checkout
- Drawer lateral en desktop / bottom sheet en mobile.
- Líneas con opciones y aclaraciones; mismo producto con distintas opciones va
  en líneas separadas. Cantidad editable y eliminar.
- Formulario: nombre*, Retiro / Delivery, dirección y referencia (si delivery,
  suma envío), pago Efectivo (¿con cuánto pagás?) / Transferencia, comentarios.
- Subtotal, envío, total. Bloquear si no llega al pedido mínimo.
- Si está cerrado: permitir armar pero avisar "Estamos cerrados, lo recibimos
  cuando abramos".
- Persistir carrito y formulario en localStorage (con try/catch).

## Mensaje de WhatsApp
Abrir `https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>` con este formato:

    🔥 *Nuevo pedido — TROPERO*

    *Cliente:* Juan
    *Entrega:* Delivery
    *Dirección:* Calle 123 (ref: portón verde)

    *Pedido:*
    2x Envueltito de carne — $XX.XXX
       + Queso extra, + Tocino
       Sin aceitunas
       _Nota: bien caliente_
    1x Pizza muzzarella (entera) — $XX.XXX

    Subtotal: $XX.XXX
    Envío: $X.XXX
    *TOTAL: $XX.XXX*

    *Pago:* Efectivo (paga con $XX.XXX)
    *Comentarios:* …

Precios con `Intl.NumberFormat('es-AR')`. Después de enviar, ofrecer "Vaciar
carrito" (no vaciarlo solo).

## Calidad
- Mobile first. Probar en 360, 390, 768 y 1280px. Sin scroll horizontal.
- Áreas táctiles de 44px mínimo. Foco visible, labels, modales cerrables con Escape.
- SEO/compartir: title, description, Open Graph con imagen 1200x630 armada con el
  envueltito y el logo, favicon con la "T", `lang="es"`. Esto importa porque el
  link va a reemplazar al Linktree en la bio de Instagram.
- Imágenes webp, lazy, con dimensiones fijas. Lighthouse mobile 90+.
- Textos en español rioplatense, tono cercano y con onda ("Pedí", "Armá", "Dale").

## Entregables
1. Sitio corriendo con `npm run dev` y build lista para Vercel.
2. `DESIGN.md` con el sistema de diseño.
3. `README.md` corto: cómo cambiar datos, productos, imágenes y colores.
4. Resumen final con: imágenes que faltan, datos marcados TODO y decisiones de
   diseño que tomaste por tu cuenta.

## Fuera de alcance
Cobro online, panel de administración, stock real, backend.
