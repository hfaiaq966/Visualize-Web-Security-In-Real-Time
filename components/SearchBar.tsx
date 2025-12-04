import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface Props {
  onSearch: (domain: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Basic cleanup
      let domain = input.replace(/^https?:\/\//, '').replace(/\/$/, '');
      onSearch(domain);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative z-20">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
        <div className="relative flex bg-white dark:bg-slate-800 rounded-full p-2 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center pl-4 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter website (e.g., google.com)"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white px-4 py-2 text-lg placeholder:text-slate-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-slate-900 dark:bg-primary text-white rounded-full p-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <ArrowRight size={20} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};