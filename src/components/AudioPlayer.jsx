import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Music2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const TRACKS = [
  { title: 'Quiet Mornings', src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
  { title: 'Soft Amber', src: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f15cecd.mp3' },
  { title: 'Still Waters', src: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5a64e05baa.mp3' },
]

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    if (playing) {
      audio.play().catch(() => {})
      let v = 0
      const fade = setInterval(() => {
        v = Math.min(v + 0.03, 0.35)
        audio.volume = v
        if (v >= 0.35) clearInterval(fade)
      }, 80)
    } else {
      let v = audio.volume
      const fade = setInterval(() => {
        v = Math.max(v - 0.03, 0)
        audio.volume = v
        if (v <= 0) { clearInterval(fade); audio.pause() }
      }, 80)
    }
  }, [playing])

  const track = TRACKS[trackIdx]

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="none"
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-full"
              style={{
                background: 'rgba(253, 251, 247, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(214, 199, 183, 0.5)',
                boxShadow: '0 8px 32px -8px rgba(78,64,53,0.15)',
              }}
            >
              <Music2 size={14} className="text-text-muted" strokeWidth={1.5} />
              <span
                className="text-xs tracking-wide"
                style={{ color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}
              >
                {playing ? track.title : 'ambient'}
              </span>
              <button
                id="audio-toggle"
                onClick={() => setPlaying(p => !p)}
                className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200"
                style={{
                  background: playing ? 'var(--text-accent)' : 'var(--accent-blush)',
                  color: playing ? '#fff' : 'var(--text-accent)',
                }}
                aria-label={playing ? 'Pause music' : 'Play music'}
              >
                {playing
                  ? <Pause size={12} strokeWidth={2} />
                  : <Play size={12} strokeWidth={2} className="ml-0.5" />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
