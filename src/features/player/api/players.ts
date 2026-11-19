import type { PlayersResponse } from '../../../types/player';

const PLAYERS_API_URL = 'https://playcdnfb.top/api/players';

export async function getPlayers(
  imdbId?: string | null,
  kinopoiskId?: number | null,
  signal?: AbortSignal,
): Promise<PlayersResponse> {
  const params = new URLSearchParams();

  if (kinopoiskId != null) {
    params.set('kinopoisk', String(kinopoiskId));
  } else if (imdbId) {
    params.set('imdb', imdbId);
  } else {
    throw new Error('У фильма отсутствует IMDb и Kinopoisk ID');
  }

  const response = await fetch(`${PLAYERS_API_URL}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки плееров: ${response.status}`);
  }

  return response.json() as Promise<PlayersResponse>;
}
