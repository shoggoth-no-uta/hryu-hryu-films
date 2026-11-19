import type { KeyboardEvent } from 'react';
import type { Movie } from '../../../types/movie';

interface MovieCardProps {
    movie: Movie;
    onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.();
        }
    };

    // Доступный рейтинг (приоритет Кинопоиск, затем IMDb)
    const rating =
        movie.rating_kp != null && movie.rating_kp !== 0
            ? { label: 'KP', value: Number(movie.rating_kp).toFixed(1) }
            : movie.rating_imdb != null && movie.rating_imdb !== 0
              ? { label: 'IMDb', value: Number(movie.rating_imdb).toFixed(1) }
              : null;

    return (
        <article
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Открыть ${movie.name}`}
            className="group flex flex-col cursor-pointer border border-zinc-800/80 bg-zinc-950/60 font-mono transition-colors duration-200 hover:border-zinc-600 hover:bg-zinc-900/40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400"
        >
            {/* Постер */}
            <div className="relative aspect-[2/3] w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
                {movie.poster ? (
                    <img
                        src={movie.poster}
                        alt={movie.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-[11px] text-zinc-600">
                        Нет постера
                    </div>
                )}

                {/* Категория */}
                {movie.category && (
                    <div className="absolute left-2 top-2 border border-zinc-800/90 bg-[#09090b]/90 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        {movie.category}
                    </div>
                )}

                {/* Рейтинг */}
                {rating && (
                    <div className="absolute bottom-2 right-2 border border-zinc-800/90 bg-[#09090b]/95 px-1.5 py-0.5 text-[10px] text-zinc-200">
                        <span className="mr-1 text-zinc-500">{rating.label}</span>
                        <span>{rating.value}</span>
                    </div>
                )}
            </div>

            {/* Описание карточки */}
            <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                    <h3
                        className="line-clamp-2 text-xs font-medium leading-snug text-zinc-200 transition-colors group-hover:text-white"
                        title={movie.name}
                    >
                        {movie.name}
                    </h3>

                    {movie.original_name && (
                        <p className="mt-1 truncate text-[11px] text-zinc-600">
                            {movie.original_name}
                        </p>
                    )}
                </div>

                {/* Год выхода */}
                <div className="mt-3 border-t border-zinc-800/70 pt-2 text-[11px] text-zinc-500">
                    {movie.year ?? '—'}
                </div>
            </div>
        </article>
    );
}