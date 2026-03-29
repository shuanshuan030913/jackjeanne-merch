import { useState, useMemo, useEffect } from 'react'
import products from './data/products.json'
import { expandQuery } from './utils/searchDictionary'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import ProductCard from './components/ProductCard'
import './App.css'

const STORAGE_KEY = 'jj-owned'

function loadOwned() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
  } catch {
    return new Set()
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState(new Set())
  const [years, setYears] = useState(new Set())
  const [ownedFilter, setOwnedFilter] = useState('')
  const [owned, setOwned] = useState(loadOwned)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...owned]))
  }, [owned])

  function toggleOwned(id) {
    setOwned((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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
        (ownedFilter === 'owned' && owned.has(p.id)) ||
        (ownedFilter === 'unowned' && !owned.has(p.id))
      return matchQuery && matchCategory && matchYear && matchOwned
    })
  }, [query, categories, years, ownedFilter, owned])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Jack Jeanne — Merch</h1>
        <p>官方周邊商品一覧 · {owned.size} 件購入済み</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <SearchBar query={query} onQueryChange={setQuery} />
          <FilterBar
            categories={categories}
            years={years}
            owned={ownedFilter}
            onCategoriesChange={setCategories}
            onYearsChange={setYears}
            onOwnedChange={setOwnedFilter}
          />
        </div>

        <div className="results-summary">
          {filtered.length} items
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                owned={owned.has(p.id)}
                onToggleOwned={toggleOwned}
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
