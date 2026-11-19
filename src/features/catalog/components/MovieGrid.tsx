import type { Movie } from '../../../types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
    movies: Movie[];
    onMovieClick?: (movie: Movie) => void;
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
    if (!movies.length) {
        return (
            <div className="border border-zinc-800/80 bg-zinc-950/30 py-16 text-center font-mono text-xs text-zinc-500">
                Фильмы не найдены
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.token_movie}
                    movie={movie}
                    onClick={() => onMovieClick?.(movie)}
                />
            ))}
        </div>
    );
}