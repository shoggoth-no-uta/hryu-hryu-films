import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Play, AlertCircle, Film } from 'lucide-react';
import type { Movie } from '../../../types/movie';
import { getPlayers } from '../api/players';
import { loadMovie } from '../utils/movieStorage';

interface MovieRouteState {
    movie?: Movie;
    from?: string;
}

export function MoviePage() {
    const { token = '' } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    const routeState = (location.state as MovieRouteState | null) ?? null;
    const movieFromState = routeState?.movie;
    const movie = movieFromState?.token_movie === token
        ? movieFromState
        : loadMovie(token);

    // A direct link should always have a safe in-app way back to the catalog.
    const requestedReturnPath = routeState?.from;
    const returnPath = requestedReturnPath?.startsWith('/') && !requestedReturnPath.startsWith('//')
        ? requestedReturnPath
        : '/';

    const imdbId = movie?.id_imdb;
    const kinopoiskId = movie?.id_kp;
    const hasMovieId = Boolean(imdbId || kinopoiskId != null);

    const {
        data: playersData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['players', imdbId, kinopoiskId],
        queryFn: ({ signal }) => getPlayers(imdbId, kinopoiskId, signal),
        enabled: Boolean(movie && hasMovieId),
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        setSelectedPlayerIndex(0);
    }, [token]);

    if (!movie) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 font-mono text-zinc-300 selection:bg-zinc-800 selection:text-zinc-100">
                <div className="w-full max-w-sm border border-zinc-800/80 bg-zinc-950/50 p-6">
                    <p className="text-xs text-zinc-500">404</p>
                    <h1 className="mt-2 text-sm font-medium text-zinc-100">
                        Фильм не найден
                    </h1>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                        Откройте фильм из каталога, чтобы сохранить его данные для этой ссылки.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="mt-6 flex w-full items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        <span>В каталог</span>
                    </button>
                </div>
            </main>
        );
    }

    const players = playersData?.data ?? [];
    const activePlayer = players[selectedPlayerIndex] ?? players[0] ?? null;

    const metaRows: Array<[string, string | number]> = [
        ['Год', movie.year],
        ['Страна', movie.country],
        ['Жанр', movie.genre],
        ['Категория', movie.category],
    ].filter(([, value]) => value != null && value !== '') as Array<[string, string | number]>;

    const ratingRows: Array<[string, string | number]> = [
        ['Кинопоиск', movie.rating_kp],
        ['IMDb', movie.rating_imdb],
    ].filter(([, value]) => value != null && value !== 0) as Array<[string, string | number]>;

    return (
        <main className="min-h-screen bg-[#09090b] font-mono text-zinc-300 selection:bg-zinc-800 selection:text-zinc-100">
            <nav aria-label="Навигация" className="border-b border-zinc-800/80 bg-[#09090b]">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <button
                        type="button"
                        onClick={() => navigate(returnPath)}
                        className="inline-flex shrink-0 items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        <span>Назад</span>
                    </button>
                    <span className="truncate text-[10px] uppercase tracking-[0.16em] text-zinc-700">
                        Hryu Hryu Films
                    </span>
                </div>
            </nav>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <section aria-label="Видеоплеер" className="border border-zinc-800/90 bg-zinc-950">
                    {players.length > 0 && (
                        <div className="flex items-center overflow-x-auto border-b border-zinc-800/90 bg-zinc-950 px-2" role="tablist" aria-label="Выбор плеера">
                            {players.map((player, index) => {
                                const active = index === selectedPlayerIndex;
                                return (
                                    <button
                                        key={`${player.type}-${index}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setSelectedPlayerIndex(index)}
                                        className={[
                                            'relative shrink-0 px-3.5 py-2.5 text-xs transition',
                                            active
                                                ? 'text-zinc-100'
                                                : 'text-zinc-500 hover:text-zinc-300',
                                        ].join(' ')}
                                    >
                                        {player.type}
                                        {active && (
                                            <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-zinc-200" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="relative aspect-video w-full bg-black">
                        {isLoading ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-zinc-500" role="status">
                                <div className="h-3.5 w-3.5 animate-spin border border-zinc-500 border-t-transparent" />
                                <span>Загрузка плееров…</span>
                            </div>
                        ) : isError ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center" role="alert">
                                <AlertCircle size={20} className="text-zinc-600" />
                                <p className="text-xs text-zinc-400">Не удалось загрузить плееры</p>
                                <p className="max-w-md text-xs text-zinc-600">
                                    {error instanceof Error ? error.message : 'Попробуйте позже'}
                                </p>
                            </div>
                        ) : !hasMovieId ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                                <Film size={20} className="text-zinc-700" />
                                <p className="text-xs text-zinc-500">
                                    Отсутствуют идентификаторы IMDb и Кинопоиска
                                </p>
                            </div>
                        ) : activePlayer ? (
                            <iframe
                                key={activePlayer.iframeUrl}
                                src={activePlayer.iframeUrl}
                                title={`${movie.name} — ${activePlayer.type}`}
                                className="h-full w-full border-0"
                                allowFullScreen
                                allow="autoplay; fullscreen; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2">
                                <Play size={20} className="text-zinc-700" />
                                <p className="text-xs text-zinc-500">Нет доступных плееров</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-8 border-t border-zinc-800/80 pt-8 md:grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr]">
                    <aside className="flex flex-row gap-4 md:flex-col">
                        {movie.poster ? (
                            <div className="w-28 shrink-0 border border-zinc-800 bg-zinc-950 p-1 md:w-full">
                                <img
                                    src={movie.poster}
                                    alt={movie.name}
                                    loading="lazy"
                                    className="aspect-[2/3] w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-[2/3] w-28 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-950 p-3 text-center text-xs text-zinc-600 md:w-full">
                                Нет постера
                            </div>
                        )}

                        {ratingRows.length > 0 && (
                            <div className="flex flex-1 flex-col justify-center gap-2 md:flex-none">
                                {ratingRows.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-baseline justify-between border border-zinc-800/80 bg-zinc-950/60 px-3 py-2"
                                    >
                                        <span className="text-[11px] text-zinc-500">{label}</span>
                                        <span className="text-sm font-medium text-zinc-100">
                                            {Number(value).toFixed(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>

                    <div className="min-w-0">
                        <header>
                            <h1 className="text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl">
                                {movie.name}
                            </h1>
                            {movie.original_name && (
                                <p className="mt-1 text-xs text-zinc-500">{movie.original_name}</p>
                            )}
                        </header>

                        {metaRows.length > 0 && (
                            <dl className="mt-6 grid grid-cols-1 gap-y-2.5 border-y border-zinc-800/80 py-4 text-xs sm:grid-cols-2 sm:gap-x-8">
                                {metaRows.map(([label, value]) => (
                                    <div key={label} className="flex items-baseline justify-between sm:justify-start sm:gap-3">
                                        <dt className="w-24 shrink-0 text-zinc-500">{label}</dt>
                                        <dd className="truncate text-zinc-200" title={String(value)}>
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {movie.description && (
                            <div className="mt-6">
                                <p className="max-w-[68ch] text-xs leading-6 text-zinc-400">
                                    {movie.description}
                                </p>
                            </div>
                        )}

                        {movie.alternative_name && (
                            <p className="mt-6 border-t border-zinc-900 pt-4 text-xs text-zinc-500">
                                Другие названия: {movie.alternative_name}
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
