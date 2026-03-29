import { useState, useMemo, useEffect } from 'react'
import products from './data/products.json'
import { expandQuery } from './utils/searchDictionary'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import ProductCard from './components/ProductCard'
import './App.css'

const STORAGE_KEY = 'jj-owned-v2'

function parsePrice(str) {
  if (!str) return null
  const match = str.match(/[\d,]+(?=円)/)
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : null
}

function loadOwned() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!raw) {
      // migrate v1 format (array of ids)
      const v1 = JSON.parse(localStorage.getItem('jj-owned'))
      if (Array.isArray(v1)) return Object.fromEntries(v1.map((id) => [id, 1]))
      return {}
    }
    return raw
  } catch {
    return {}
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState(new Set())
  const [years, setYears] = useState(new Set())
  const [ownedFilter, setOwnedFilter] = useState('')
  const [owned, setOwned] = useState(loadOwned)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount = categories.size + years.size + (ownedFilter ? 1 : 0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(owned))
  }, [owned])

  function setQuantity(id, qty) {
    setOwned((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  const ownedCount = Object.keys(owned).length

  const totalSpent = useMemo(() => {
    return products.reduce((sum, p) => {
      const qty = owned[p.id] || 0
      if (!qty) return sum
      const price = parsePrice(p.price)
      return price ? sum + price * qty : sum
    }, 0)
  }, [owned])

  const filtered = useMemo(() => {
    const terms = expandQuery(query)
    return [...products].reverse().filter((p) => {
      const searchTarget = p.name.toLowerCase()
      const matchQuery =
        terms.length === 0 || terms.some((t) => searchTarget.includes(t))
      const matchCategory = categories.size === 0 || categories.has(p.category)
      const matchYear = years.size === 0 || years.has(p.year)
      const matchOwned =
        ownedFilter === '' ||
        (ownedFilter === 'owned' && owned[p.id] > 0) ||
        (ownedFilter === 'unowned' && !owned[p.id])
      return matchQuery && matchCategory && matchYear && matchOwned
    })
  }, [query, categories, years, ownedFilter, owned])

  return (
    <div className="app">
      <div className="sticky-top">
        <header className="app-header">
          <h1>Jack Jeanne — Merch</h1>
          <div className="header-stats">
            <span>{ownedCount} / {products.length} 件購入済み</span>
            {totalSpent > 0 && (
              <span className="header-total">¥{totalSpent.toLocaleString()}</span>
            )}
          </div>
        </header>

        <div className="controls">
          <div className="controls-row">
            <SearchBar query={query} onQueryChange={setQuery} />
            <button
              className={`filter-toggle${filtersOpen ? ' open' : ''}${activeFilterCount > 0 ? ' has-filters' : ''}`}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              篩選
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
              <span className="toggle-chevron" />
            </button>
          </div>

          <div className={`filter-collapsible${filtersOpen ? ' expanded' : ''}`}>
            <FilterBar
              categories={categories}
              years={years}
              owned={ownedFilter}
              onCategoriesChange={setCategories}
              onYearsChange={setYears}
              onOwnedChange={setOwnedFilter}
            />
          </div>
        </div>
      </div>

      <main className="app-main">
        <div className="results-summary">
          {filtered.length} items
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                quantity={owned[p.id] || 0}
                onSetQuantity={setQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">No items found</div>
        )}
      </main>
    </div>
  )
}
