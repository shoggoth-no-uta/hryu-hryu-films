import type { Movie } from '../../../types/movie';

const STORAGE_PREFIX = 'hryu-hryu:movie:';

function isMovie(value: unknown): value is Movie {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<Movie>;
  return (
    typeof candidate.token_movie === 'string' &&
    typeof candidate.name === 'string'
  );
}

export function saveMovie(movie: Movie): void {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${movie.token_movie}`,
      JSON.stringify(movie),
    );
  } catch {
    // Storage may be unavailable or full; navigation should still work.
  }
}

function parseStoredMovie(stored: string | null, token: string): Movie | null {
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    return isMovie(parsed) && parsed.token_movie === token ? parsed : null;
  } catch {
    return null;
  }
}

export function loadMovie(token: string): Movie | null {
  let fromLocalStorage: string | null = null;
  let fromSessionStorage: string | null = null;

  try {
    fromLocalStorage = localStorage.getItem(`${STORAGE_PREFIX}${token}`);
  } catch {
    // Continue with sessionStorage if localStorage is unavailable.
  }

  try {
    fromSessionStorage = sessionStorage.getItem(`movie:${token}`);
  } catch {
    // The route can still render its not-found state if all storage is blocked.
  }

  const movie =
    parseStoredMovie(fromLocalStorage, token) ??
    parseStoredMovie(fromSessionStorage, token);

  if (movie) saveMovie(movie);
  return movie;
}
