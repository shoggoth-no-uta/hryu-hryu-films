import { HashRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '../features/catalog/pages/HomePage';
import { NotFoundPage } from '../features/catalog/pages/NotFoundPage';
import { MoviePage } from '../features/player/pages/MoviePage';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:token" element={<MoviePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
