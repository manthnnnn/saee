import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-center gap-2.5 py-8"
      style={{
        background: '#2D2926',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <p
        style={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '0.75rem',
          color: 'rgba(253,251,247,0.2)',
          letterSpacing: '0.12em',
        }}
      >
        made with
      </p>
      <Heart
        size={11}
        fill="rgba(163,107,94,0.5)"
        stroke="none"
      />
      <p
        style={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '0.75rem',
          color: 'rgba(253,251,247,0.2)',
          letterSpacing: '0.12em',
        }}
      >
        by Manthan
      </p>
    </footer>
  )
}
