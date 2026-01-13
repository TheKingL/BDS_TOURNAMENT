import { useState, useEffect } from 'react';
import BracketSolo from '../../components/BracketSolo';

export default function BracketPage() {
    const [players, setPlayers] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/players.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/bracket.json`).then(res => res.json())
        ])
            .then(([playersData, bracketData]) => {
                setPlayers(playersData);
                setBracket(bracketData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading bracket:', err);
                setLoading(false);
            });
    }, []);

    const getPlayerName = (playerId) => {
        if (!playerId) return null;
        const player = players.find(p => p.id === playerId);
        return player ? player.name : playerId;
    };

    if (loading || !bracket) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement du bracket...</p>
                </div>
            </div>
        );
    }

    // Tournament status
    const qfPlayed = bracket.quarterFinals.filter(m => m.played).length;
    const sfPlayed = bracket.semiFinals.filter(m => m.played).length;
    const finalWins = bracket.final.matches.filter(m => m.played).length;

    let statusText = 'En attente des résultats de la ligue';
    if (qfPlayed > 0) statusText = `Quarts de finale (${qfPlayed}/4)`;
    if (qfPlayed === 4) statusText = `Demi-finales (${sfPlayed}/2)`;
    if (sfPlayed === 2) statusText = 'Finales en cours';
    if (bracket.final.winner) statusText = 'Tournoi terminé !';

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold text-blue-400" style={{ marginBottom: '0.5rem' }}>
                    🏓 Ping-Pong Solo - Bracket
                </h1>
                <p className="text-sm text-text-secondary">{statusText}</p>
            </div>

            {/* Bracket */}
            <div className="bg-bg-card border border-border rounded-2xl" style={{ marginBottom: '2rem' }}>
                <BracketSolo bracket={bracket} players={players} />
            </div>

            {/* Winner */}
            {bracket.final.winner && (
                <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl inline-block" style={{ padding: '1.5rem 2rem' }}>
                        <p className="text-sm text-text-muted" style={{ marginBottom: '0.5rem' }}>🏆 Champion</p>
                        <p className="text-2xl font-bold text-blue-400">{getPlayerName(bracket.final.winner)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
