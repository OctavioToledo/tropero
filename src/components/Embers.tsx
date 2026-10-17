import { useEffect, useRef } from 'react'

interface Spark {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  life: number
  max: number
  hue: number
}

/** Chispas de brasa subiendo. Canvas liviano (~30 partículas), se pausa fuera de pantalla. */
export function Embers({ count = 30 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const spawn = (initial = false): Spark => {
      const max = 160 + Math.random() * 220
      return {
        x: w * (0.2 + Math.random() * 0.6),
        y: initial ? h * (0.3 + Math.random() * 0.7) : h * (0.75 + Math.random() * 0.25),
        r: 0.6 + Math.random() * 1.8,
        vy: 0.25 + Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        life: initial ? Math.random() * max : 0,
        max,
        hue: 18 + Math.random() * 22,
      }
    }

    resize()
    const sparks = Array.from({ length: count }, () => spawn(true))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i]
        s.life++
        s.y -= s.vy
        s.x += s.vx + Math.sin((s.life + i * 20) / 30) * 0.3
        const t = s.life / s.max
        if (t >= 1 || s.y < -10) {
          sparks[i] = spawn()
          continue
        }
        const alpha = Math.sin(Math.PI * t) * 0.9
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0, `hsla(${s.hue}, 95%, 65%, ${alpha})`)
        g.addColorStop(1, `hsla(${s.hue}, 95%, 50%, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [count])

  return <canvas ref={ref} className="embers" aria-hidden="true" />
}
