import { useState, useEffect } from 'react';

export default function PlayersPage() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/players.json`)
            .then(res => res.json())
            .then(data => {
                setPlayers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading players:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement des joueurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold text-blue-400" style={{ marginBottom: '0.5rem' }}>
                    🏓 Ping-Pong Solo - Joueurs
                </h1>
                <p className="text-sm text-text-secondary">{players.length} joueurs inscrits</p>
            </div>

            {/* Players Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
            {players.length === 0 ? (
                <div className="text-center bg-bg-card border border-border rounded-xl" style={{ padding: '3rem' }}>
                    <p className="text-text-muted text-lg">Aucun joueur inscrit pour le moment</p>
                    <p className="text-text-muted text-sm" style={{ marginTop: '0.5rem' }}>Les inscriptions arrivent bientôt !</p>
                </div>
            ) : (
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    style={{ gap: '1rem' }}
                >
                    {players.map((player, index) => {
                        const firstName = player.name?.split(' ')[0] || '?';
                        const lastName = player.name?.split(' ').slice(1).join(' ') || '';

                        return (
                            <div
                                key={player.id}
                                className="bg-bg-card border border-border rounded-xl transition-all hover:border-blue-500 animate-fadeIn"
                                style={{ padding: '1.25rem', animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center" style={{ marginBottom: '0.75rem' }}>
                                        <span className="text-white font-bold text-xl">{firstName.charAt(0)}</span>
                                    </div>
                                    <p className="font-bold text-text-primary">{firstName}</p>
                                    <p className="text-sm text-text-muted">{lastName}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
