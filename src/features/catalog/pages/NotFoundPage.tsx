import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 font-mono text-zinc-300">
      <section className="w-full max-w-sm border border-zinc-800/80 bg-zinc-950/50 p-6">
        <p className="text-xs text-zinc-500">404</p>
        <h1 className="mt-2 text-sm font-medium text-zinc-100">Страница не найдена</h1>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Такой страницы нет. Вернитесь в каталог, чтобы продолжить просмотр.
        </p>
        <Link
          to="/"
          className="mt-6 flex w-full items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          В каталог
        </Link>
      </section>
    </main>
  );
}
