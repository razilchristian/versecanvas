import { Search, Loader2 } from 'lucide-react';

const CATEGORIES = ['Motivation', 'Love', 'Faith', 'Anxiety', 'Peace'];

export default function SearchBar({ query, setQuery, onSearch, loading, onCategoryClick }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="max-w-2xl mx-auto text-center mb-16">
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
        Discover & Design <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Beautiful Scriptures</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
        Search any Bible verse and transform it into a stunning, shareable poster in seconds.
      </p>

      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto shadow-sm shadow-slate-200/50 rounded-2xl group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          placeholder="e.g. John 3:16, Psalm 23..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-2 right-2 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Categories */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryClick(cat)}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
