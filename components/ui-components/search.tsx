"use client"

import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { X, SearchIcon } from "lucide-react"


interface SearchBoxProps {
  onSearch: (query: string) => void;
  isSidebarOpen?: boolean; // Add prop to handle sidebar open/close state
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isSidebarOpen = false }) => {
  const [query, setQuery] = useState('');

  
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => onSearch(searchQuery), 500),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div
      className={`flex items-center text-black p-2  ${isSidebarOpen ? 'md:pl-64' : ''}`} // Adjust padding based on sidebar state
    >
      {/* Optionally hide search in mobile when sidebar is open */}
      {!isSidebarOpen && (
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
          <div className="relative md:w-[395px] w-full h-[48px]">
            <input
              type="text"
              className={`w-full py-2 border border-[#E2E6EF] pl-10 pr-2
               rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder='searchhere'
              value={query}
              onChange={handleChange}
              // style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
            <div
              className={`absolute inset-y-0  mb-1 left-0 pl-2
              flex items-center text-[#78829D]  text-xl `}
            >
               <SearchIcon/> 
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBox;

