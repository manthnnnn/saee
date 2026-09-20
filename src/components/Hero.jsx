import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ParticleCanvas from './ParticleCanvas'

const HEADLINE = ['For', 'Saee.']

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 }
  }
}

const wordVar = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut', delay: 0.8 } }
}

const lineVar = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.4 } }
}

export default function Hero() {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <ParticleCanvas />

      {/* Radial warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(240,217,213,0.35) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          className="label-text mb-10"
          style={{ letterSpacing: '0.25em' }}
        >
          a quiet place, just for you
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          className="flex gap-5 mb-8"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            fontWeight: 400,
            lineHeight: 1,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}
        >
          {HEADLINE.map((word, i) => (
            <motion.span key={i} variants={wordVar}>
              {word === 'Saee.' ? (
                <span style={{ color: 'var(--text-accent)', fontStyle: 'italic' }}>{word}</span>
              ) : word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Divider line */}
        <motion.div
          variants={lineVar}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          style={{
            height: '1px',
            width: '80px',
            background: 'var(--accent-gold)',
            originX: 0,
            marginBottom: '2rem',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut', delay: 1.6 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
            color: 'var(--text-muted)',
            fontWeight: 300,
            letterSpacing: '0.01em',
            lineHeight: 1.7,
            maxWidth: '440px',
          }}
        >
          There is something rare about you — a stillness that carries warmth,
          a presence that makes the world feel more honest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2.4 }}
          className="mt-16"
        >
          <a
            href="#portrait"
            className="flex flex-col items-center gap-2 group"
            style={{ textDecoration: 'none' }}
          >
            <span className="label-text" style={{ letterSpacing: '0.18em' }}>scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: '1px',
                height: '36px',
                background: 'linear-gradient(to bottom, var(--accent-gold), transparent)',
              }}
            />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
