import { useState, useEffect } from "react";
// import { useAuth } from "../../../context/AuthContext";
import { useAuth } from "../../../store/slices/hooks";
import { useNavigate } from "react-router-dom";
import { Preferences } from "../types/Preferences";
import { updatePreferences } from "../services/preferencesService";
import { fetchGenres, fetchLanguages } from "../../../services/genreService";
import { Genre, Language } from "../../../services/types/genre";

export function usePreferences() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState<Preferences>({
    favoriteGenres: [],
    languages: [],
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch genres and languages on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        console.log("Starting to load genres and languages...");

        // Fetch genres and languages separately to handle individual failures
        let genresData: Genre[] = [];
        let languagesData: Language[] = [];
        let hasErrors = false;

        try {
          genresData = await fetchGenres();
          console.log("Successfully loaded genres:", genresData.length);
        } catch (err) {
          console.error("Failed to fetch genres:", err);
          hasErrors = true;
        }

        try {
          languagesData = await fetchLanguages();
          console.log("Successfully loaded languages:", languagesData.length);
        } catch (err) {
          console.error("Failed to fetch languages:", err);
          hasErrors = true;
        }

        setGenres(genresData);
        setLanguages(languagesData);

        if (hasErrors) {
          if (genresData.length === 0 && languagesData.length === 0) {
            setError("Failed to load genres and languages");
          } else {
            setError("");
          }
        } else {
          setError("");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Error loading data:", errorMsg);
        setError(`Failed to load genres and languages: ${errorMsg}`);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleGenreToggle = (genreId: string) => {
    setPreferences((prev) => {
      const updated = [...prev.favoriteGenres];
      const index = updated.indexOf(genreId);
      if (index > -1) {
        updated.splice(index, 1);
      } else {
        updated.push(genreId);
      }
      return { ...prev, favoriteGenres: updated };
    });
    setError("");
  };

  const handleLanguageToggle = (languageCode: string) => {
    setPreferences((prev) => {
      const updated = [...prev.languages];
      const index = updated.indexOf(languageCode);
      if (index > -1) {
        updated.splice(index, 1);
      } else {
        updated.push(languageCode);
      }
      return { ...prev, languages: updated };
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Token is in HttpOnly cookie, credentials: 'include' handles it
      await updatePreferences(user.id, preferences);
      // On success, redirect to home
      navigate("/home");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences",
      );
      console.error("Error saving preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip without saving - just navigate home
    navigate("/home");
  };

  return {
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
  };
}
