import { useState, useEffect } from 'react';
import Bracket from '../components/Bracket';

export default function BracketPage() {
    const [teams, setTeams] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/bracket.json`).then(res => res.json())
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement du bracket...</p>
                </div>
            </div>
        );
    }

    const getTeamName = (teamId) => {
        if (!teamId) return null;
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    const getTeamPlayers = (teamId) => {
        if (!teamId) return [];
        const team = teams.find(t => t.id === teamId);
        return team ? team.players : [];
    };

    // Tournament status
    const qfPlayed = bracket.quarterFinals.filter(m => m.played).length;
    const sfPlayed = bracket.semiFinals.filter(m => m.played).length;
    const finalWins = bracket.final.matches.filter(m => m.played).length;

    let statusText = 'En attente des résultats des poules';
    if (qfPlayed > 0) statusText = `Quarts de finale (${qfPlayed}/4)`;
    if (qfPlayed === 4) statusText = `Demi-finales (${sfPlayed}/2)`;
    if (sfPlayed === 2) statusText = 'Finales en cours';
    if (bracket.final.winner) statusText = 'Tournoi terminé !';

    return (
        <div style={{ padding: '3rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-4xl font-bold gradient-text" style={{ marginBottom: '0.75rem' }}>
                    Phase Éliminatoire
                </h1>
                <p className="text-base text-text-secondary">{statusText}</p>
            </div>

            {/* Bracket */}
            <div
                className="bg-bg-card border border-border rounded-2xl"
                style={{ marginBottom: '2rem' }}
            >
                <Bracket bracket={bracket} teams={teams} />
            </div>

            {/* Winner display */}
            {bracket.final.winner && (
                <div className="text-center animate-fadeIn" style={{ marginBottom: '2rem' }}>
                    <div
                        className="inline-block bg-gradient-to-br from-green-darker to-bg-card border-2 border-green-primary rounded-3xl shadow-2xl"
                        style={{ padding: '2rem 3rem' }}
                    >
                        <p className="text-sm font-medium text-green-light uppercase tracking-wider" style={{ marginBottom: '0.5rem' }}>
                            🏆 Champions 🏆
                        </p>
                        <h2 className="text-4xl font-bold text-text-primary" style={{ marginBottom: '1rem' }}>
                            {getTeamName(bracket.final.winner)}
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            {getTeamPlayers(bracket.final.winner).map((player, idx) => (
                                <span
                                    key={idx}
                                    className="bg-bg-secondary text-text-secondary rounded-full"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    {player}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Format explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1rem' }}>
                <div className="bg-bg-card border border-border rounded-2xl" style={{ padding: '1.25rem' }}>
                    <h3 className="font-bold text-text-primary" style={{ marginBottom: '0.5rem' }}>
                        🎯 Quarts & Demis
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Match sec (2 manches de 2min30). L'équipe qui perd est éliminée.
                    </p>
                </div>
                <div className="bg-bg-card border border-border rounded-2xl" style={{ padding: '1.25rem' }}>
                    <h3 className="font-bold text-text-primary" style={{ marginBottom: '0.5rem' }}>
                        🥉 Petite Finale
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Les perdants des demi-finales s'affrontent pour la 3ème place.
                    </p>
                </div>
                <div className="bg-bg-card border border-green-dark rounded-2xl bg-green-darker/20" style={{ padding: '1.25rem' }}>
                    <h3 className="font-bold text-green-light" style={{ marginBottom: '0.5rem' }}>
                        🏆 Grande Finale (BO3)
                    </h3>
                    <p className="text-text-secondary text-sm">
                        Best of 3 : il faut gagner 2 matchs pour remporter le titre !
                    </p>
                </div>
            </div>
        </div>
    );
}
