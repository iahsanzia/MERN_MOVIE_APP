import React from 'react';

interface SearchBoxProps {
  onSearch?: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-full border-2 border-gray-700 hover:border-red-500 transition max-w-md">
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
      />
    </div>
  );
};
