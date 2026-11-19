import { useQuery } from '@tanstack/react-query';
import { getMovies, searchMovies } from '../api/movies';

export function useMovies(page: number, search: string) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: ['movies', page, normalizedSearch],
    queryFn: ({ signal }) =>
      normalizedSearch
        ? searchMovies(normalizedSearch, page, signal)
        : getMovies(page, signal),
    staleTime: 1000 * 60 * 5,
  });
}
