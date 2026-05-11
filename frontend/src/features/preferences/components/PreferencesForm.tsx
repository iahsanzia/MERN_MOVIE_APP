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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: `
          radial-gradient(ellipse at 80% 100%, rgba(120,0,0,0.35) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 0%, #7b0000 0%, #3d0000 35%, #1a0000 60%, #0d0000 100%)
        `,
      }}
    >
      <div
        className="max-w-5xl w-full rounded-2xl p-8 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Preferences
          </h1>
          <p className="text-white/60 text-lg">
            Personalize your movie experience by selecting your favorite genres
            and preferred languages
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 text-red-200 rounded-xl">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Genres Section */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-xl font-semibold text-white">
              Favorite Genres
            </h2>
            <span className="text-white/40 text-sm">
              ({preferences.favoriteGenres.length} selected)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {genres.map((genre) => {
              const isSelected = preferences.favoriteGenres.includes(
                genre.id.toString(),
              );
              return (
                <label
                  key={genre.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "border border-red-500 text-white"
                      : "border text-white/75 hover:text-white"
                  }`}
                  style={{
                    background: isSelected
                      ? "rgba(185,28,28,0.5)"
                      : "rgba(255,255,255,0.06)",
                    borderColor: isSelected
                      ? "#ef4444"
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onGenreToggle(genre.id.toString())}
                    className="w-4 h-4 rounded accent-red-500 cursor-pointer flex-shrink-0"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium">{genre.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Languages Section */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-xl font-semibold text-white">
              Preferred Languages
            </h2>
            <span className="text-white/40 text-sm">
              ({preferences.languages.length} selected)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((language) => {
              const isSelected = preferences.languages.includes(
                language.iso_639_1,
              );
              return (
                <label
                  key={language.iso_639_1}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "border border-red-500 text-white"
                      : "border text-white/75 hover:text-white"
                  }`}
                  style={{
                    background: isSelected
                      ? "rgba(185,28,28,0.5)"
                      : "rgba(255,255,255,0.06)",
                    borderColor: isSelected
                      ? "#ef4444"
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onLanguageToggle(language.iso_639_1)}
                    className="w-4 h-4 rounded accent-red-500 cursor-pointer flex-shrink-0"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium">
                    {language.english_name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onSkip}
            disabled={loading}
            className="flex-1 py-3 px-6 font-semibold text-white rounded-xl transition-colors disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.13)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
          >
            Skip for Now
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-red-700 hover:bg-red-800 disabled:opacity-50 font-semibold text-white rounded-xl transition-colors"
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
