import React, { useState, useEffect, useRef, useCallback } from "react";
import { Movie } from "../types";
import { movieService } from "../../../services/movieService";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  onMovieSuggestionSelect?: (movie: Movie) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  onMovieSuggestionSelect,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      const results = await movieService.searchMovies(searchQuery);
      // Limit to 5 results
      setSuggestions(results.slice(0, 5));
      setShowDropdown(true);
    } catch (err) {
      console.error("Search failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search (300ms)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (movie: Movie) => {
    if (onMovieSuggestionSelect) {
      onMovieSuggestionSelect(movie);
    }
    setQuery("");
    setShowDropdown(false);
    setSuggestions([]);
  };

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
      setQuery("");
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (onSearch) onSearch(query);
    setQuery("");
    setShowDropdown(false);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full max-w-md"
      style={{ zIndex: 50 }}
    >
      <div
        className="flex items-center rounded-full overflow-hidden"
        style={{
          border: "2px solid rgba(255, 255, 255, 0.5)",
          backgroundColor: "transparent",
        }}
      >
        {/* Search Icon */}
        <div className="pl-4 pr-2 flex items-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
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
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() =>
            query.trim() && suggestions.length > 0 && setShowDropdown(true)
          }
          style={{
            flex: 1,
            padding: "12px 8px",
            backgroundColor: "transparent",
            color: "white",
            outline: "none",
            border: "none",
            fontSize: "14px",
            WebkitAppearance: "none",
          }}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{
            margin: "4px",
            padding: "8px 20px",
            backgroundColor: "#dc2626",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#b91c1c")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc2626")
          }
        >
          Search
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && (query.trim() || loading) && (
        <div
          className="absolute top-full left-0 right-0 mt-2 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          style={{
            zIndex: 1000,
            backgroundColor: "#1a1a1a",
            backdropFilter: "none",
          }}
        >
          {loading ? (
            <div className="p-4 text-center text-gray-300">
              <div className="inline-block animate-spin">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className="px-4 py-3 hover:bg-gray-800 cursor-pointer transition border-b border-gray-800 last:border-b-0 flex items-start gap-3"
              >
                {/* Poster thumbnail */}
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded flex-shrink-0"
                  />
                )}
                {/* Movie info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {movie.title}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}{" "}
                    • {movie.vote_average?.toFixed(1) || "N/A"}★
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">No movies found</div>
          )}
        </div>
      )}
    </div>
  );
};
