import { apiRequest } from '../../../api/client';
import type { MovieQueryParams, MovieSearchResponse } from '../../../types/movie';

// Поиск фильмов по названию.
export function searchMovies(
  name: string,
  page = 1,
  signal?: AbortSignal,
) {
  return apiRequest<MovieSearchResponse>(
    {
      name: name.trim(),
      list: '',
      page: page > 1 ? page : undefined,
    },
    signal,
  );
}

// Получение списка фильмов.
export function getMovies(
  params: MovieQueryParams = {},
  signal?: AbortSignal,
) {
  return apiRequest<MovieSearchResponse>(
    {
      list: '',
      ...params,
    },
    signal,
  );
}
