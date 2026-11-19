import type { FormEvent } from 'react';
import { Search, X, LoaderCircle } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="relative w-full" role="search" onSubmit={handleSubmit}>
      <Search
        size={15}
        aria-hidden="true"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
      />

      <input
        id="movie-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Название фильма или сериала..."
        aria-label="Поиск фильмов"
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full appearance-none border border-zinc-800 bg-[#111111] py-2 pl-10 pr-11 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-600 hover:border-zinc-700 focus:border-zinc-500"
      />

      <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center">
        {isLoading ? (
          <LoaderCircle
            size={15}
            aria-label="Поиск выполняется"
            className="animate-spin text-zinc-500"
          />
        ) : value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Очистить поиск"
            className="text-zinc-600 transition hover:text-white"
          >
            <X size={15} />
          </button>
        ) : (
          <span className="text-[9px] text-zinc-700">ENTER</span>
        )}
      </div>
    </form>
  );
}
