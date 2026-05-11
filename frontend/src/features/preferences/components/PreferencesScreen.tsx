import React from "react";
import { usePreferences } from "../hooks/usePreferences";
import { PreferencesForm } from "./PreferencesForm";

export function PreferencesScreen() {
  const {
    preferences,
    genres,
    languages,
    loading,
    error,
    isLoadingData,
    handleGenreToggle,
    handleLanguageToggle,
    handleSubmit,
    handleSkip,
  } = usePreferences();

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white text-xl">Loading preferences...</div>
      </div>
    );
  }

  return (
    <PreferencesForm
      preferences={preferences}
      genres={genres}
      languages={languages}
      onGenreToggle={handleGenreToggle}
      onLanguageToggle={handleLanguageToggle}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
      loading={loading}
      error={error}
    />
  );
}
