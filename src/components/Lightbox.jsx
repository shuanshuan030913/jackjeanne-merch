import { useEffect, useState } from 'react'

export default function Lightbox({ src, alt, onClose }) {
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className={`lightbox-overlay${closing ? ' closing' : ''}`}
      onClick={handleClose}
      onAnimationEnd={() => { if (closing) onClose() }}
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img className="lightbox-img" src={src} alt={alt} />
        <button className="lightbox-close" onClick={handleClose}>
          CLOSE
        </button>
      </div>
    </div>
  )
}
