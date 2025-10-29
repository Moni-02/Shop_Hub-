import React, { useState, useEffect } from 'react';
import { Grid, List, Filter, SlidersHorizontal } from 'lucide-react';
import { Product } from '../contexts/CartContext';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  searchQuery: string;
}

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'rating' | 'newest';

const ProductList: React.FC<ProductListProps> = ({ products, searchQuery }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const maxProductPrice = Math.max(...products.map(p => p.price));

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = products.filter(product => {
      // Search filter
      const matchesSearch = searchQuery.trim() === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category;

      // Price filter
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

      // Rating filter
      const matchesRating = product.rating.rate >= filters.minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order
        break;
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">{filteredAndSortedProducts.length} products found</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Sort by Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <SlidersHorizontal className="h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500">Min Price</label>
                  <input
                    type="range"
                    min="0"
                    max={maxProductPrice}
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">${filters.minPrice}</span>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max={maxProductPrice}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">${filters.maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{filters.minRating}+ stars</span>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                category: 'all',
                minPrice: 0,
                maxPrice: maxProductPrice,
                minRating: 0
              })}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;