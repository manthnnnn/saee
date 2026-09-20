import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const QUALITIES = [
  {
    word: 'Calm',
    description: 'The kind that doesn\'t need to announce itself. It just settles the air around you.',
    icon: '◌',
    color: 'var(--accent-sage)',
  },
  {
    word: 'Genuine',
    description: 'You say what you mean. That\'s rarer than you know, and more beautiful for it.',
    icon: '◇',
    color: 'var(--accent-blush)',
  },
  {
    word: 'Warm',
    description: 'Not in a loud way — in the way a room feels when the right person walks in.',
    icon: '○',
    color: 'rgba(229, 195, 136, 0.45)',
  },
  {
    word: 'Grounded',
    description: 'You have a quiet sense of knowing — of yourself, of what matters.',
    icon: '△',
    color: 'var(--accent-sage)',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } }
}

const card = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

export default function Portrait() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="portrait"
      className="section-pad"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
          ref={ref}
        >
          <p className="label-text mb-4">who you are</p>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--text-main)',
              maxWidth: '520px',
            }}
          >
            The qualities that live in you, quietly.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {QUALITIES.map((q) => (
            <motion.div
              key={q.word}
              variants={card}
              className="card-glass p-7 md:p-8 flex flex-col gap-5"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: q.color, color: 'var(--text-muted)' }}
              >
                {q.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    color: 'var(--text-main)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {q.word}
                </p>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                    fontWeight: 300,
                  }}
                >
                  {q.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
