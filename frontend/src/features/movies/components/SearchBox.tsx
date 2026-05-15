import React from "react";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
    }
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div
      className="flex items-center w-full max-w-md rounded-full overflow-hidden"
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
  );
};
