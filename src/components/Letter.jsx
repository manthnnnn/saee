import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const LETTER_TEXT = [
  'Saee,',
  '',
  'I don\'t know that I have the right words — I\'m not sure the right words exist. But I know this: being around you has made me quieter in the best way. Less noise, less restlessness. More of the kind of peace that doesn\'t need to be explained.',
  '',
  'You are kind in ways that are easy to miss if you\'re not paying attention. I notice them. The small ones especially.',
  '',
  'This isn\'t about anything in particular. No occasion, no reason. Just — you matter. And I thought you should have somewhere that says so, plainly, without fanfare.',
  '',
  'With love,',
  'Manthan',
]

export default function Letter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [open, setOpen] = useState(false)

  // When section enters view, open the letter
  const wasOpen = useRef(false)
  if (inView && !wasOpen.current) {
    wasOpen.current = true
    setTimeout(() => setOpen(true), 400)
  }

  return (
    <section
      id="letter"
      className="section-pad"
      style={{ background: 'var(--bg-primary)' }}
      ref={ref}
    >
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="label-text mb-12"
        >
          a letter
        </motion.p>

        {/* Envelope wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={open ? { opacity: 1, y: 0, scale: 1 } : inView ? { opacity: 1, y: 0, scale: 0.97 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Paper card */}
          <div
            className="relative px-9 py-10 md:px-14 md:py-14 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #FDFBF7 0%, #F7F3EC 100%)',
              border: '1px solid var(--card-border)',
              boxShadow: '0 20px 60px -20px rgba(78,64,53,0.12), 0 4px 16px -4px rgba(78,64,53,0.06)',
            }}
          >
            {/* Decorative top seal */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
              style={{ background: 'var(--accent-gold)', opacity: 0.7 }}
            />

            {/* Letter text */}
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                fontWeight: 300,
                color: 'var(--text-main)',
                lineHeight: 1.9,
              }}
            >
              {LETTER_TEXT.map((line, i) => {
                if (line === '') return <div key={i} style={{ height: '1em' }} />
                if (line === 'Saee,') return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={open ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.06 }}
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.4rem',
                      color: 'var(--text-accent)',
                      fontStyle: 'italic',
                      marginBottom: '0.5em',
                    }}
                  >
                    {line}
                  </motion.p>
                )
                if (line === 'Manthan') return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={open ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 1.4 }}
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.25rem',
                      color: 'var(--text-accent)',
                      fontStyle: 'italic',
                      marginTop: '0.2em',
                    }}
                  >
                    {line}
                  </motion.p>
                )
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={open ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + i * 0.07 }}
                  >
                    {line}
                  </motion.p>
                )
              })}
            </div>

            {/* Bottom line decoration */}
            <div
              className="mt-10 mx-auto"
              style={{ height: '1px', width: '60px', background: 'var(--accent-gold)', opacity: 0.6 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
