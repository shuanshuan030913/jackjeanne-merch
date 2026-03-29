import { useState } from 'react'
import Lightbox from './Lightbox'

const CATEGORY_LABEL = {
  sticker: 'ステッカー',
  acrylic: 'アクリル',
  badge: '缶バッジ',
  card: 'カード',
  poster: 'ポスター',
  other: 'その他',
}

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)

export default function ProductCard({ product, quantity, onSetQuantity }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isOwned = quantity > 0

  return (
    <>
      <div className={`product-card${isOwned ? ' is-owned' : ''}`}>
        <div className="product-image" onClick={() => setLightboxOpen(true)}>
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://placehold.co/280x200?text=No+Image' }}
          />
          <div className="image-zoom-hint">🔍</div>
        </div>
        <div className="product-info">
          <div className="product-tags">
            <span className="tag tag-category">{CATEGORY_LABEL[product.category]}</span>
            <span className="tag tag-year">{product.year}</span>
          </div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-meta">
            <span>{product.varieties}</span>
            <span>{product.releaseDate}</span>
          </div>
          <div className="product-price">
            <span className="price-main">{product.price}</span>
            {product.boxPrice && (
              <span className="price-box">
                BOX {product.boxPrice}（{product.boxQuantity}）
              </span>
            )}
          </div>
          <div className="product-distribution">{product.distribution}</div>
          <div className="card-footer">
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="detail-link"
            >
              詳細はこちら →
            </a>
            {isOwned ? (
              <div className="qty-stepper">
                <button
                  className="qty-btn"
                  onClick={() => onSetQuantity(product.id, quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => onSetQuantity(product.id, quantity + 1)}
                >
                  ＋
                </button>
              </div>
            ) : (
              <button
                className="owned-toggle"
                onClick={() => onSetQuantity(product.id, 1)}
              >
                <CheckIcon />
                未購入
              </button>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          src={product.image}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
