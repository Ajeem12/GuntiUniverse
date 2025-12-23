import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useSearch from "../../hooks/useSearch";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { searchProducts } = useSearch();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save to recent searches when a search is performed
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item.toLowerCase() !== query.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setIsLoading(true);
      try {
        await searchProducts(searchQuery);
        saveToRecentSearches(searchQuery);
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setIsFocused(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <form onSubmit={handleSearchSubmit}>
        <div className={`flex items-center bg-gray-100 rounded-lg px-5 py-3 shadow-sm transition-all duration-200 ${isFocused ? 'ring-2 ring-emerald-500 shadow-md' : 'hover:shadow-md'}`}>
          <button type="submit" className="mr-3 text-gray-500">
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-gray-400 border-t-emerald-500 rounded-full animate-spin"></div>
            ) : (
              <FiSearch className="h-5 w-5" />
            )}
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, services..."
            className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 text-sm md:text-base"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Searchbar;