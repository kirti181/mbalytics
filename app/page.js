'use client';

import { useState } from 'react';

const categories = ['GM', '1G', '2AG', '2BG', '3AG', '3BG', 'SCG', 'STG', 'NKN'];
const cities = ['All cities', 'Bengaluru', 'Belagavi', 'Mangaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Davanagere', 'Shivamogga', 'Tumakuru', 'Manipal', 'Udupi', 'Hassan', 'Kalaburagi', 'Ballari', 'Bidar', 'Raichur', 'Mandya', 'Kolar'];

export default function Home() {
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('GM');
  const [city, setCity] = useState('All cities');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search(event) {
    event.preventDefault();
    setError(''); setResults([]); setLoading(true);
    try {
      const cityParam = city === 'All cities' ? '' : `&city=${encodeURIComponent(city)}`;
      const response = await fetch(`/api/colleges?rank=${encodeURIComponent(rank)}&category=${category}${cityParam}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Search failed');
      setResults(body.colleges);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return <main className="shell">
    <section className="hero">
      <div className="eyebrow">KEA PGCET 2025 · Round 1 · RoK</div>
      <h1>Find your MBA college.</h1>
      <p>Enter your rank and category to see colleges where the published cutoff rank is within your reach.</p>
      <form onSubmit={search} className="search-card">
        <label>KCET / PGCET rank<input type="number" min="1" required value={rank} onChange={e => setRank(e.target.value)} placeholder="e.g. 1200" /></label>
        <label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>City<select value={city} onChange={e => setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select></label>
        <button disabled={loading}>{loading ? 'Searching…' : 'Find colleges'}</button>
      </form>
      <div className="hint">Lower cutoff rank is more competitive. Results are based on the uploaded KEA dataset.</div>
    </section>
    <section className="results">
      {error && <div className="notice error">{error}</div>}
      {!loading && !error && rank && results.length === 0 && <div className="notice">No matching colleges found for this rank, category, and city.</div>}
      {results.length > 0 && <><div className="results-head"><h2>Matching colleges</h2><span>{results.length} found</span></div><div className="grid">{results.map(college => <article className="college" key={college.code}><div className="rank">#{college.rank}</div><div><h3>{college.name}</h3><p className="city">◉ {college.city || 'Unknown city'}</p><p className="code">Code {college.code} · Cutoff {college.cutoffRank.toLocaleString()}</p></div></article>)}</div></>}
    </section>
    <footer>Data source: KEA PGCET 2025 First Round Allotment Cut-Off Ranks (RoK)</footer>
  </main>;
}
