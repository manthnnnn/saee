import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const LINES = [
  'You bring a kind of stillness',
  'that makes everything feel—',
  'possible.',
]

export default function LightSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="light"
      className="relative overflow-hidden section-pad"
      style={{ background: 'var(--bg-tertiary)' }}
    >
      {/* Soft blush gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-10%',
          top: '10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,217,213,0.55) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Pull quote */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="label-text mb-8"
            >
              what you bring
            </motion.p>

            <div className="flex flex-col gap-1">
              {LINES.map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.p
                    initial={{ y: '100%', opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.15 }}
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                      fontWeight: 400,
                      lineHeight: 1.25,
                      color: i === 2 ? 'var(--text-accent)' : 'var(--text-main)',
                      fontStyle: i === 2 ? 'italic' : 'normal',
                    }}
                  >
                    {line}
                  </motion.p>
                </div>
              ))}
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              style={{
                marginTop: '2rem',
                height: '1px',
                width: '100px',
                background: 'var(--accent-gold)',
                originX: 0,
              }}
            />
          </div>

          {/* Right — Abstract art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <AbstractOrb />
          </motion.div>
        </div>

        {/* Two-column prose */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 pt-16"
          style={{ borderTop: '1px solid var(--card-border)' }}
        >
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.75 }}>
            There's a lightness that follows you — not because you ignore what's heavy,
            but because you've learned how to hold things gently without letting them hold you.
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.75 }}>
            That quality — the grace of being fully present — is rarer than most things.
            And it makes the ordinary feel worth noticing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function AbstractOrb() {
  return (
    <svg
      width="340"
      height="340"
      viewBox="0 0 340 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Outer ring */}
      <circle cx="170" cy="170" r="155" stroke="rgba(229,195,136,0.25)" strokeWidth="1" />
      <circle cx="170" cy="170" r="120" stroke="rgba(240,217,213,0.4)" strokeWidth="1" />

      {/* Soft filled circles */}
      <circle cx="170" cy="170" r="85" fill="rgba(240,217,213,0.22)" />
      <circle cx="170" cy="145" r="55" fill="rgba(216,224,213,0.28)" />
      <circle cx="195" cy="185" r="40" fill="rgba(229,195,136,0.2)" />

      {/* Accent dots */}
      <circle cx="110" cy="110" r="4" fill="rgba(163,107,94,0.35)" />
      <circle cx="240" cy="130" r="3" fill="rgba(163,107,94,0.25)" />
      <circle cx="150" cy="240" r="5" fill="rgba(229,195,136,0.45)" />
      <circle cx="220" cy="215" r="2.5" fill="rgba(107,122,102,0.3)" />

      {/* Cross hairlines */}
      <line x1="170" y1="20" x2="170" y2="60" stroke="rgba(229,195,136,0.3)" strokeWidth="0.8" />
      <line x1="170" y1="280" x2="170" y2="320" stroke="rgba(229,195,136,0.3)" strokeWidth="0.8" />
      <line x1="20" y1="170" x2="60" y2="170" stroke="rgba(229,195,136,0.3)" strokeWidth="0.8" />
      <line x1="280" y1="170" x2="320" y2="170" stroke="rgba(229,195,136,0.3)" strokeWidth="0.8" />

      {/* Center mark */}
      <circle cx="170" cy="170" r="3" fill="rgba(163,107,94,0.5)" />
    </svg>
  )
}
