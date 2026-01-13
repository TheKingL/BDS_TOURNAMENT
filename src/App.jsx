import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TeamsPage from './pages/TeamsPage';
import PoolsPage from './pages/PoolsPage';
import BracketPage from './pages/BracketPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter basename="/BDS_TOURNAMENT">
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <Navbar />
        <main className="flex-1" style={{ padding: '0 1rem' }}>
          <Routes>
            <Route path="/" element={<TeamsPage />} />
            <Route path="/pools" element={<PoolsPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-border" style={{ padding: '2rem 0' }}>
          <div className="text-center">
            <p className="text-text-muted text-sm">
              BDS TOURNAMENT © 2026 - Bureau des Sports
            </p>
            <p className="text-text-muted text-xs" style={{ marginTop: '0.5rem' }}>
              ⚽ Tournoi de Babyfoot
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
