import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, AlertCircle, X } from 'lucide-react';

import { useMovies } from '../hooks/useMovies';
import { useDebounce } from '../../../hooks/useDebounce';
import { Pagination } from '../../../components/ui/Pagination';
import type { Movie } from '../../../types/movie';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { saveMovie } from '../../player/utils/movieStorage';

function parsePage(value: string | null): number {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const searchFromUrl = searchParams.get('q') ?? '';
    const page = parsePage(searchParams.get('page'));
    const [search, setSearch] = useState(searchFromUrl);
    const debouncedSearch = useDebounce(search.trim(), 400);

    // Restore the input when the user navigates Back/Forward in browser history.
    useEffect(() => {
        setSearch(searchFromUrl);
    }, [searchFromUrl]);

    const updateSearchParams = (value: string) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            const normalized = value.trim();

            if (normalized) {
                next.set('q', value);
            } else {
                next.delete('q');
            }

            // A different query always starts from the first result page.
            next.delete('page');
            return next;
        }, { replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        updateSearchParams(value);
    };

    const handleSearchSubmit = () => {
        const normalized = search.trim();
        setSearch(normalized);
        updateSearchParams(normalized);
    };

    const handlePageChange = (nextPage: number) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (nextPage > 1) {
                next.set('page', String(nextPage));
            } else {
                next.delete('page');
            }
            return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useMovies(page, debouncedSearch);

    const handleMovieClick = (movie: Movie) => {
        saveMovie(movie);
        navigate(`/movie/${encodeURIComponent(movie.token_movie)}`, {
            state: {
                movie,
                from: `${location.pathname}${location.search}`,
            },
        });
    };

    const movies = data?.data ?? [];
    const isWaitingForSearch = search.trim() !== debouncedSearch;
    const isWaitingForResults = isLoading || isWaitingForSearch;

    return (
        <main className="min-h-screen bg-[#09090b] font-mono text-zinc-300 selection:bg-zinc-800 selection:text-zinc-100">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                <header className="mb-8 border-b border-zinc-800/80 pb-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                                Hryu Hryu Films
                            </p>
                            <h1 className="text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl">
                                Каталог
                            </h1>
                        </div>
                        <span className="text-xs tabular-nums text-zinc-500">
                            Страница {page}
                        </span>
                    </div>

                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                            <label htmlFor="movie-search">Поиск по названию</label>
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange('')}
                                    className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-zinc-200"
                                >
                                    <X size={12} aria-hidden="true" />
                                    <span>Очистить</span>
                                </button>
                            )}
                        </div>

                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                            onSubmit={handleSearchSubmit}
                            isLoading={isWaitingForSearch || isFetching}
                        />
                    </div>
                </header>

                {isWaitingForResults ? (
                    <div
                        className="flex min-h-64 flex-col items-center justify-center gap-3 border border-zinc-800/60 bg-zinc-950/30"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="h-4 w-4 animate-spin border border-zinc-500 border-t-transparent" />
                        <p className="text-xs text-zinc-500">Загрузка…</p>
                    </div>
                ) : isError ? (
                    <div className="flex min-h-64 flex-col items-center justify-center border border-zinc-800/80 bg-zinc-950/50 px-4 text-center" role="alert">
                        <AlertCircle size={20} className="mb-3 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-200">
                            Не удалось загрузить каталог
                        </p>
                        <p className="mt-1.5 max-w-md text-xs text-zinc-500">
                            {error instanceof Error
                                ? error.message
                                : 'Попробуйте обновить страницу позже.'}
                        </p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center border border-zinc-800/80 bg-zinc-950/30 px-4 text-center">
                        <Search size={20} className="mb-3 text-zinc-600" />
                        <h2 className="text-xs font-medium text-zinc-300">
                            Ничего не найдено
                        </h2>
                        <p className="mt-1.5 text-xs text-zinc-500">
                            {debouncedSearch
                                ? `По запросу «${debouncedSearch}» результатов нет.`
                                : 'Список пока пуст.'}
                        </p>

                        {debouncedSearch && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange('')}
                                className="mt-5 border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900"
                            >
                                Сбросить поиск
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {debouncedSearch && (
                            <div className="mb-4 text-xs text-zinc-500" aria-live="polite">
                                Результаты по запросу «{debouncedSearch}»: {movies.length}
                            </div>
                        )}

                        <MovieGrid movies={movies} onMovieClick={handleMovieClick} />

                        <footer className="mt-10 border-t border-zinc-800/80 pt-6">
                            <Pagination
                                currentPage={page}
                                nextPage={data?.next_page ?? null}
                                prevPage={data?.prev_page ?? null}
                                onPageChange={handlePageChange}
                                disabled={isFetching}
                            />
                        </footer>
                    </>
                )}
            </div>
        </main>
    );
}
