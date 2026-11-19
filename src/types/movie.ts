export interface Movie {
  name: string;
  original_name: string | null;
  alternative_name: string | null;

  year: number | null;
  category: string | null;
  category_id?: number;

  id_kp: number | null;
  id_imdb: string | null;
  token_movie: string;

  poster: string | null;
  description: string | null;

  country: string | null;
  genre: string | null;

  rating_kp: number | null;
  rating_imdb: number | null;

  iframe: string | null;
  iframe_trailer: string | null;

  translation_iframe?: Record<string, Translation>;
  seasons?: Record<string, Season>;
}

export interface Translation {
  name?: string;
  translation?: string;
  quality?: string;
  iframe: string;
  adv?: boolean;
}

export interface Season {
  season: number;
  iframe: string;
  episodes: Record<string, Episode>;
}

export interface Episode {
  episode: number;
  iframe: string;
  translation?: Record<string, Translation>;
}

export interface MovieSearchResponse {
  status: string;
  data: Movie[];
  next_page: number | null;
  prev_page: number | null;
}

export interface MovieDetailsResponse {
  status: string;
  data: Movie;
}