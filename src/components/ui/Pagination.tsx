import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  nextPage,
  prevPage,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (prevPage === null && nextPage === null) {
    return null;
  }

  return (
    <nav
      aria-label="Навигация по страницам каталога"
      className="mt-10 flex items-center justify-center gap-5"
    >
      <button
        type="button"
        disabled={disabled || prevPage === null}
        onClick={() => prevPage !== null && onPageChange(prevPage)}
        className="flex items-center gap-2 border border-zinc-700 px-4 py-2 text-xs text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Назад
      </button>

      <span className="text-xs tabular-nums text-zinc-400" aria-current="page">
        Страница {currentPage}
      </span>

      <button
        type="button"
        disabled={disabled || nextPage === null}
        onClick={() => nextPage !== null && onPageChange(nextPage)}
        className="flex items-center gap-2 border border-zinc-700 px-4 py-2 text-xs text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Вперёд
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
