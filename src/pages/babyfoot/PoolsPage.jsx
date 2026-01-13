import { useState, useEffect } from 'react';
import PoolTable from '../../components/PoolTable';
import MatchList from '../../components/MatchList';

export default function PoolsPage() {
    const [teams, setTeams] = useState([]);
    const [poolsData, setPoolsData] = useState({ pools: [], matches: [] });
    const [loading, setLoading] = useState(true);
    const [activePool, setActivePool] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/babyfoot/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/babyfoot/pools.json`).then(res => res.json())
        ])
            .then(([teamsData, poolsJson]) => {
                setTeams(teamsData);
                setPoolsData(poolsJson);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement des poules...</p>
                </div>
            </div>
        );
    }

    const { pools, matches } = poolsData;
    const playedMatches = matches.filter(m => m.played).length;
    const totalMatches = matches.length;

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>
                    ⚽ Babyfoot - Poules
                </h1>
                <p className="text-sm text-text-secondary">
                    {playedMatches}/{totalMatches} matchs joués
                </p>
            </div>

            {/* Pool Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                {pools.map((pool) => (
                    <PoolTable key={pool.id} pool={pool} teams={teams} matches={matches} />
                ))}
            </div>

            {/* Match Schedule */}
            <div style={{ marginTop: '2rem' }}>
                <div className="flex flex-wrap items-center justify-between" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
                    <h2 className="text-xl font-bold text-text-primary">Matchs</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActivePool('all')}
                            className={`font-semibold transition-all rounded-lg ${activePool === 'all' ? 'bg-green-primary text-bg-primary' : 'bg-bg-card text-text-secondary'}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                        >
                            Tous
                        </button>
                        {pools.map(pool => (
                            <button
                                key={pool.id}
                                onClick={() => setActivePool(pool.id)}
                                className={`font-semibold transition-all rounded-lg ${activePool === pool.id ? 'bg-green-primary text-bg-primary' : 'bg-bg-card text-text-secondary'}`}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                            >
                                Poule {pool.id}
                            </button>
                        ))}
                    </div>
                </div>
                <MatchList matches={matches} teams={teams} poolId={activePool === 'all' ? null : activePool} />
            </div>
        </div>
    );
}
