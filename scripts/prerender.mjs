// Inyecta el HTML de la app en dist/index.html para que el hero pinte antes de que cargue el JS.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const { render } = await import('../dist-ssr/entry-server.js')
const file = new URL('../dist/index.html', import.meta.url)
const html = readFileSync(file, 'utf8')
if (!html.includes('<!--app-->')) throw new Error('No encontré <!--app--> en dist/index.html')
writeFileSync(file, html.replace('<!--app-->', render()))
rmSync(new URL('../dist-ssr', import.meta.url), { recursive: true, force: true })
console.log('prerender ok')
