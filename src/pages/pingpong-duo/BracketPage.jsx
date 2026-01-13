import { useState, useEffect } from 'react';
import BracketDuo from '../../components/BracketDuo';

export default function BracketPage() {
    const [teams, setTeams] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/bracket.json`).then(res => res.json())
        ])
            .then(([teamsData, bracketData]) => {
                setTeams(teamsData);
                setBracket(bracketData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading bracket:', err);
                setLoading(false);
            });
    }, []);

    const getTeamName = (teamId) => {
        if (!teamId) return null;
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    if (loading || !bracket) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement du bracket...</p>
                </div>
            </div>
        );
    }

    // Tournament status (starts at SF!)
    const sfPlayed = bracket.semiFinals.filter(m => m.played).length;
    const finalWins = bracket.final.matches.filter(m => m.played).length;

    let statusText = 'En attente des résultats de la ligue';
    if (sfPlayed > 0) statusText = `Demi-finales (${sfPlayed}/2)`;
    if (sfPlayed === 2) statusText = 'Finales en cours';
    if (bracket.final.winner) statusText = 'Tournoi terminé !';

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold text-purple-400" style={{ marginBottom: '0.5rem' }}>
                    🏓 Ping-Pong Duo - Bracket
                </h1>
                <p className="text-sm text-text-secondary">{statusText}</p>
            </div>

            {/* Bracket */}
            <div className="bg-bg-card border border-border rounded-2xl" style={{ marginBottom: '2rem' }}>
                <BracketDuo bracket={bracket} teams={teams} />
            </div>

            {/* Winner */}
            {bracket.final.winner && (
                <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-2xl inline-block" style={{ padding: '1.5rem 2rem' }}>
                        <p className="text-sm text-text-muted" style={{ marginBottom: '0.5rem' }}>🏆 Champions</p>
                        <p className="text-2xl font-bold text-purple-400">{getTeamName(bracket.final.winner)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
