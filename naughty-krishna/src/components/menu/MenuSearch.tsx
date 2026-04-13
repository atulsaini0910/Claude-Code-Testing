import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/lib/utils';

interface MenuSearchProps {
  onSearch: (query: string) => void;
}

export function MenuSearch({ onSearch }: MenuSearchProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const debouncedSearch = debounce((q: unknown) => onSearch(q as string), 300);
    debouncedSearch(value);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search dishes..."
        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-saffron-500/60 transition-colors"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
