import { useState, useEffect } from 'react';
import PoolTable from '../components/PoolTable';
import MatchList from '../components/MatchList';

export default function PoolsPage() {
    const [teams, setTeams] = useState([]);
    const [poolsData, setPoolsData] = useState({ pools: [], matches: [] });
    const [loading, setLoading] = useState(true);
    const [activePool, setActivePool] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pools.json`).then(res => res.json())
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
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>Phase de Poules</h1>
                <p className="text-sm sm:text-base text-text-secondary">
                    {playedMatches}/{totalMatches} matchs joués
                </p>
                {/* Progress bar */}
                <div style={{ maxWidth: '300px', margin: '1rem auto 0' }}>
                    <div className="bg-bg-secondary rounded-full overflow-hidden" style={{ height: '0.375rem' }}>
                        <div
                            className="bg-gradient-to-r from-green-light to-green-primary transition-all duration-500"
                            style={{ height: '100%', width: `${(playedMatches / totalMatches) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Pool Tables - stacked on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                {pools.map((pool) => (
                    <PoolTable
                        key={pool.id}
                        pool={pool}
                        teams={teams}
                        matches={matches}
                    />
                ))}
            </div>

            {/* Match Schedule */}
            <div style={{ marginTop: '2rem' }}>
                {/* Header + filters - stack on mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between" style={{ marginBottom: '1rem', gap: '0.75rem' }}>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Matchs</h2>

                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActivePool('all')}
                            className={`font-semibold transition-all rounded-lg ${activePool === 'all'
                                ? 'bg-green-primary text-bg-primary'
                                : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                                }`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                        >
                            Tous
                        </button>
                        {pools.map(pool => (
                            <button
                                key={pool.id}
                                onClick={() => setActivePool(pool.id)}
                                className={`font-semibold transition-all rounded-lg ${activePool === pool.id
                                    ? 'bg-green-primary text-bg-primary'
                                    : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                                    }`}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                            >
                                {pool.name}
                            </button>
                        ))}
                    </div>
                </div>

                <MatchList
                    matches={matches}
                    teams={teams}
                    poolId={activePool === 'all' ? null : activePool}
                />
            </div>

            {/* Legend - wrap on mobile */}
            <div
                className="bg-bg-card border border-border rounded-xl"
                style={{ marginTop: '1.5rem', padding: '1rem' }}
            >
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider" style={{ marginBottom: '0.75rem' }}>
                    Barème
                </h3>
                <div className="flex flex-wrap" style={{ gap: '1rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="bg-green-primary text-bg-primary flex items-center justify-center text-xs font-bold" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%' }}>3</span>
                        <span className="text-text-secondary">Victoire</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="bg-green-dark text-text-primary flex items-center justify-center text-xs font-bold" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%' }}>2</span>
                        <span className="text-text-secondary">Nul</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="bg-bg-secondary text-text-muted flex items-center justify-center text-xs font-bold" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%' }}>1</span>
                        <span className="text-text-secondary">Défaite</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="bg-red-900 text-red-400 flex items-center justify-center text-xs font-bold" style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%' }}>0</span>
                        <span className="text-text-secondary">Forfait</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
