import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
// Babyfoot
import BabyfootTeamsPage from './pages/babyfoot/TeamsPage';
import BabyfootPoolsPage from './pages/babyfoot/PoolsPage';
import BabyfootBracketPage from './pages/babyfoot/BracketPage';
// Ping-Pong Solo
import PingpongSoloPlayersPage from './pages/pingpong-solo/PlayersPage';
import PingpongSoloLiguePage from './pages/pingpong-solo/LiguePage';
import PingpongSoloBracketPage from './pages/pingpong-solo/BracketPage';
// Ping-Pong Duo
import PingpongDuoTeamsPage from './pages/pingpong-duo/TeamsPage';
import PingpongDuoLiguePage from './pages/pingpong-duo/LiguePage';
import PingpongDuoBracketPage from './pages/pingpong-duo/BracketPage';
// Admin
import AdminPage from './pages/AdminPage';
// Errors
import { ErrorPage, ErrorBoundary } from './pages/errors';

function App() {
  return (
    <BrowserRouter basename="/BDS_TOURNAMENT">
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <Navbar />
        <main className="flex-1" style={{ padding: '0 1rem' }}>
          <ErrorBoundary>
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Babyfoot */}
              <Route path="/babyfoot" element={<BabyfootTeamsPage />} />
              <Route path="/babyfoot/poules" element={<BabyfootPoolsPage />} />
              <Route path="/babyfoot/bracket" element={<BabyfootBracketPage />} />

              {/* Ping-Pong Solo */}
              <Route path="/pingpong-solo" element={<PingpongSoloPlayersPage />} />
              <Route path="/pingpong-solo/ligue" element={<PingpongSoloLiguePage />} />
              <Route path="/pingpong-solo/bracket" element={<PingpongSoloBracketPage />} />

              {/* Ping-Pong Duo */}
              <Route path="/pingpong-duo" element={<PingpongDuoTeamsPage />} />
              <Route path="/pingpong-duo/ligue" element={<PingpongDuoLiguePage />} />
              <Route path="/pingpong-duo/bracket" element={<PingpongDuoBracketPage />} />

              {/* Admin - Only in development */}
              {!import.meta.env.PROD && <Route path="/admin" element={<AdminPage />} />}

              {/* 404 - Catch all */}
              <Route path="*" element={<ErrorPage code={404} />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="border-t border-border" style={{ padding: '1.5rem 0' }}>
          <div className="text-center">
            <p className="text-text-muted text-sm">
              BDS TOURNAMENT © 2026 - Bureau des Sports ESIGELEC
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
