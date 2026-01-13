import { useState, useEffect } from 'react';
import Bracket from '../../components/Bracket';

export default function BracketPage() {
    const [teams, setTeams] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/babyfoot/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/babyfoot/bracket.json`).then(res => res.json())
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

    if (loading || !bracket) {
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

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>
                    ⚽ Babyfoot - Bracket
                </h1>
                <p className="text-sm text-text-secondary">Phase éliminatoire</p>
            </div>

            {/* Bracket */}
            <div className="bg-bg-card border border-border rounded-2xl" style={{ marginBottom: '2rem' }}>
                <Bracket bracket={bracket} teams={teams} />
            </div>

            {/* Winner */}
            {bracket.final.winner && (
                <div className="text-center">
                    <div className="bg-gradient-to-r from-green-darker to-green-dark rounded-2xl inline-block" style={{ padding: '1.5rem 2rem' }}>
                        <p className="text-sm text-text-muted" style={{ marginBottom: '0.5rem' }}>🏆 Champion</p>
                        <p className="text-2xl font-bold text-green-light">{getTeamName(bracket.final.winner)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
