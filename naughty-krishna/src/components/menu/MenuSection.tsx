import { useState, useCallback } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryFilter } from './CategoryFilter';
import { MenuSearch } from './MenuSearch';
import { MenuGrid } from './MenuGrid';
import { MENU_ITEMS } from '@/data/menu';
import type { MenuCategory } from '@/types';

interface MenuSectionProps {
  id: string;
}

export function MenuSection({ id }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const filtered = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="Our Menu"
            subtitle="19 dishes crafted with authentic Indian flavours — from street-style chaats to bold fusion innovations. Every bite is 100% vegetarian."
          />
        </AnimatedSection>

        {/* Filter + Search bar */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex-1">
              <CategoryFilter
                active={activeCategory}
                onChange={setActiveCategory}
              />
            </div>
            <div className="w-full md:w-64">
              <MenuSearch onSearch={handleSearch} />
            </div>
          </div>
        </AnimatedSection>

        {/* Count */}
        <AnimatedSection delay={0.15}>
          <p className="text-cream/40 text-sm mb-6">
            Showing <span className="text-saffron-400 font-semibold">{filtered.length}</span> of {MENU_ITEMS.length} dishes
          </p>
        </AnimatedSection>

        <MenuGrid items={filtered} />
      </div>
    </section>
  );
}
