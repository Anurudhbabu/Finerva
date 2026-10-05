import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Layers
} from 'lucide-react';
import { marketWatchlist } from '../data/mockData';

export const MarketView = () => {
  const [watchlist, setWatchlist] = useState(marketWatchlist);
  const [searchTerm, setSearchTerm] = useState('');
  const [starredSymbols, setStarredSymbols] = useState(['NVDA', 'S&P 500', 'BTC/USD']);

  const toggleStar = (symbol) => {
    setStarredSymbols(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const filteredItems = watchlist.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Market Watchlist & Asset Pulse</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time valuation metrics, index performance, and tech sector trends</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ticker or index..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Featured Index Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white">S&P 500</span>
            <span className="text-emerald-400 font-bold">+0.84% Today</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">5,864.20</p>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-3">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '74%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white">NIFTY 50</span>
            <span className="text-emerald-400 font-bold">+1.12% Today</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">25,120.40</p>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-3">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white">Bitcoin Network</span>
            <span className="text-emerald-400 font-bold">+2.88% Today</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">$65,420.00</p>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-3">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Tracked Securities</h2>
          <span className="text-xs text-slate-400">Auto-refresh: 15s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Security</th>
                <th className="pb-3">Last Price</th>
                <th className="pb-3">24h Change</th>
                <th className="pb-3 hidden sm:table-cell">Trading Volume</th>
                <th className="pb-3 text-right pr-2">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredItems.map((item) => {
                const isStarred = starredSymbols.includes(item.symbol);
                return (
                  <tr key={item.symbol} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                          {item.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{item.symbol}</p>
                          <p className="text-[11px] text-slate-400">{item.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-bold text-slate-100 text-sm">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                        item.positive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {item.change}
                      </span>
                    </td>

                    <td className="py-3.5 hidden sm:table-cell text-slate-400 font-mono">
                      {item.volume}
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <button 
                        onClick={() => toggleStar(item.symbol)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isStarred 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
