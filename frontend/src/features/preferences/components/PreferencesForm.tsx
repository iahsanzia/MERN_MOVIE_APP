import React from "react";
import { Genre, Language } from "../../../services/genreService";
import { Preferences } from "../types/Preferences";

interface PreferencesFormProps {
  preferences: Preferences;
  genres: Genre[];
  languages: Language[];
  onGenreToggle: (genreId: string) => void;
  onLanguageToggle: (languageCode: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  loading: boolean;
  error: string;
}

export function PreferencesForm({
  preferences,
  genres,
  languages,
  onGenreToggle,
  onLanguageToggle,
  onSubmit,
  onSkip,
  loading,
  error,
}: PreferencesFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red via-black to-gray flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full bg-gray-800/90 backdrop-blur rounded-lg p-8 shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Preferences
          </h1>
          <p className="text-gray-300 text-lg">
            Personalize your movie experience by selecting your favorite genres and preferred languages
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 text-red-200 rounded-lg">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Genres Section */}
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Favorite Genres</h2>
            <span className="ml-4 text-gray-400 text-sm">({preferences.favoriteGenres.length} selected)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {genres.map((genre) => {
              const isSelected = preferences.favoriteGenres.includes(
                genre.id.toString(),
              );
              return (
                <label
                  key={genre.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-red-600 text-white border border-red-500 shadow-lg shadow-red-600/30"
                      : "bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onGenreToggle(genre.id.toString())}
                    className="w-5 h-5 rounded accent-red-500 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="ml-3 font-medium">{genre.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Languages Section */}
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Preferred Languages</h2>
            <span className="ml-4 text-gray-400 text-sm">({preferences.languages.length} selected)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((language) => {
              const isSelected = preferences.languages.includes(
                language.iso_639_1,
              );
              return (
                <label
                  key={language.iso_639_1}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-red-600 text-white border border-red-500 shadow-lg shadow-red-600/30"
                      : "bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onLanguageToggle(language.iso_639_1)}
                    className="w-5 h-5 rounded accent-red-500 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="ml-3 font-medium">{language.english_name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onSkip}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 font-bold text-white rounded-lg transition-colors border border-gray-600"
          >
            Skip for Now
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 font-bold text-white rounded-lg transition-colors shadow-lg shadow-red-600/30"
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
