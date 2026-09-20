import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ParticleCanvas from './ParticleCanvas'

export default function Closing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="closing"
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-pad"
      style={{ background: '#2D2926' }}
    >
      <ParticleCanvas dark />

      {/* Warm radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(163,107,94,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center max-w-xl px-6" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="label-text mb-10"
          style={{ color: 'rgba(229,195,136,0.5)' }}
        >
          always
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 400,
            color: '#FDFBF7',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          This place is{' '}
          <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
            yours.
          </span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          style={{
            height: '1px',
            width: '60px',
            background: 'rgba(229,195,136,0.4)',
            margin: '2rem auto',
            originX: 0.5,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.9 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            color: 'rgba(253,251,247,0.5)',
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          Whenever you need to be reminded that you are seen,
          appreciated, and steady in someone's world — come back here.
        </motion.p>

        {/* Stars */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
            style={{
              display: 'inline-block',
              marginTop: '3rem',
              marginLeft: i === 0 ? 0 : '0.5rem',
              color: 'rgba(229,195,136,0.4)',
              fontSize: '0.5rem',
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>
    </section>
  )
}
