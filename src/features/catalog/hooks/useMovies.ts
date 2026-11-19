import { useQuery } from '@tanstack/react-query';
import { getMovies, searchMovies } from '../api/movies';
import type { MovieQueryParams } from '../../../types/movie';

export function useMovies(
  params: MovieQueryParams = {},
  search = '',
) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: ['movies', params, normalizedSearch],

    queryFn: ({ signal }) =>
      normalizedSearch
        ? searchMovies(
            normalizedSearch,
            params.page ?? 1,
            signal,
          )
        : getMovies(params, signal),

    staleTime: 1000 * 60 * 5,
  });
}