# TROPERO — Sistema de diseño

## Concepto: "Fogón de tropero"

Noche, brasa, cuero, madera. Oscuro, cálido y con textura. Titulares contundentes y lectura limpia y aireada.
Los envueltitos son el protagonista visual.

## Paleta

Definida como variables en `:root` (`src/styles.css`). Nunca negro ni blanco puros.

| Variable        | Hex       | Uso                                           |
| --------------- | --------- | --------------------------------------------- |
| `--carbon`      | `#14110F` | Fondo principal                               |
| `--tierra`      | `#1D1814` | Fondo de secciones alternas, inputs           |
| `--cuero`       | `#2A221C` | Tarjetas, modales, drawer                     |
| `--cuero-borde` | `#3A2F26` | Bordes y divisores                            |
| `--brasa`       | `#E8722C` | Acento principal: CTAs, precios, estado activo |
| `--brasa-hover` | `#F2873F` | Hover de brasa                                |
| `--ocre`        | `#D9A441` | Acento secundario: badges, eyebrows, íconos   |
| `--crema`       | `#F3E9DA` | Texto principal                               |
| `--arena`       | `#B5A592` | Texto secundario                              |
| `--salvia`      | `#8A9A5B` | "Abierto", éxito, badge Veggie                |
| `--rojo-seco`   | `#B4432F` | Errores, "Cerrado", badge Picante             |

Contraste: crema sobre carbón ≈ 15:1, arena sobre cuero ≈ 6:1, carbón sobre brasa ≈ 6:1 (todos AA o más).

## Tipografía (Google Fonts)

- **Anton**, mayúsculas, tracking `0.02–0.04em`: hero, títulos de sección, nombres de categorías y envueltitos.
- **Fraunces** itálica 400–500: slogan "envueltitos y algo más", subtítulos emocionales, frases destacadas.
- **Manrope** 400/500/700: texto y UI. Precios en 700 con `font-variant-numeric: tabular-nums`.
- Escala fluida: hero `clamp(3.5rem, 22vw, 8rem)`; H2 `clamp(2.25rem, …, 4rem)`.

## Texturas y detalles

- Grano global: SVG `feTurbulence` fijo, opacidad 4,5 % (`.grain`).
- Viñeta radial naranja detrás y debajo de cada foto de producto (luz de fogón).
- Divisor "costura de cuero" (línea punteada en `--cuero-borde`) con la marca de hierro "T" al centro.
- Radios: 16px tarjetas, 999px botones y chips, 22px sheets. Sombras cálidas (tinte marrón/brasa).
- Íconos: lucide, trazo 1.75, color ocre. WhatsApp e Instagram son SVG propios (`Icons.tsx`).

## Componentes

- **Botón primario**: fondo brasa, texto carbón, Manrope 700 mayúsculas, alto 52px. Hover: brasa-hover y sube 2px. Active: escala 0.97.
- **Botón secundario**: borde 1.5px crema al 30 %, texto crema, hover con borde brasa.
- **Chips**: fondo cuero; activo con fondo brasa y texto carbón (`aria-pressed`).
- **Badges**: Estrella (ocre), Nuevo (crema), Picante (rojo seco), Veggie (salvia).
- **Tarjeta de producto**: vertical desde 600px; en mobile horizontal (foto 118px a la izquierda) para escanear el menú rápido.
- **Placeholder**: bloque con rayado sutil, glow brasa, ícono y nombre del plato en Fraunces. Nunca hotlinks.

## Animaciones

| Dónde              | Qué                                                                  |
| ------------------ | -------------------------------------------------------------------- |
| Hero               | "TROPERO" letra por letra desde abajo (máscara), slogan, CTAs. < 1,4 s |
| Hero               | Chispas en canvas (~30), pausadas fuera de viewport                   |
| Plato del hero     | Flota ±8px en 6 s, glow que respira, parallax leve al scrollear       |
| Marquee            | Cinta infinita de categorías en Anton ocre                            |
| Scroll reveal      | Fade + 24px, escalonado 60 ms, una sola vez                           |
| Agregar al carrito | Miniatura vuela al carrito, contador con bounce, toast "Agregado"     |
| Tarjetas           | Zoom 1.05 en la foto, el precio se ilumina                            |
| Modales / drawer   | Spring suave, backdrop con blur                                       |

`prefers-reduced-motion`: sin chispas, parallax, flotado, marquee ni vuelos; solo fades.

## Layout

- Mobile first. Gutter 16px (32px desde 768px). Ancho máximo 1200px.
- Grilla del menú: 1 col → 2 (600px) → 3 (960px) → 4 (1200px).
- Áreas táctiles de 44px mínimo, foco visible en ocre.
