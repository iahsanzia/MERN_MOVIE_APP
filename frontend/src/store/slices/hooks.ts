import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector as <T>(
  selector: (state: RootState) => T,
) => T;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  return { user, token, isAuthenticated, isLoading, dispatch };
};

export const useMoviesContext = () => {
  const dispatch = useAppDispatch();
  const { selectedMovie, favorites, watched } = useAppSelector(
    (state) => state.movies,
  );
  return { selectedMovie, favorites, watched, dispatch };
};
