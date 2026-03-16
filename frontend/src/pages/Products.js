import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key:'all', label:'🥥 All' },
  { key:'fresh', label:'🌿 Fresh' },
  { key:'oil', label:'🫙 Oils' },
  { key:'bulk', label:'🎊 Bulk/Marriage' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || 'all';
    setSearch(s); setCategory(c);
    setLoading(true);
    const params = {};
    if (s) params.search = s;
    if (c && c !== 'all') params.category = c;
    API.get('/products', { params })
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (search.trim()) p.search = search.trim();
    if (category !== 'all') p.category = category;
    setSearchParams(p);
  };

  const handleCat = (c) => {
    setCategory(c);
    const p = {};
    if (search.trim()) p.search = search.trim();
    if (c !== 'all') p.category = c;
    setSearchParams(p);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <h1>Our Products</h1>
        <p>Farm-fresh coconut products - sourced directly from Tamil Nadu farms</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <button type="submit">Search</button>
        </form>
        <div className="category-tabs">
          {CATEGORIES.map(c => (
            <button key={c.key} className={`cat-tab ${category===c.key?'active':''}`} onClick={()=>handleCat(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">{[...Array(4)].map((_,i)=><div key={i} className="skeleton-card"/>)}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🥥</div>
          <h3>No products found</h3>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
