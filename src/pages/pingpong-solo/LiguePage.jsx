import { useState, useEffect } from 'react';

export default function LiguePage() {
    const [players, setPlayers] = useState([]);
    const [league, setLeague] = useState({ players: [], matches: [] });
    const [loading, setLoading] = useState(true);
    const [filterPlayer, setFilterPlayer] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/players.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/league.json`).then(res => res.json())
        ])
            .then(([playersData, leagueData]) => {
                setPlayers(playersData);
                setLeague(leagueData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setLoading(false);
            });
    }, []);

    const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : playerId;
    };

    // Get first name with last initial (e.g. "Théo T.")
    const getPlayerFirstName = (playerId) => {
        const player = players.find(p => p.id === playerId);
        if (!player) return playerId;
        const parts = player.name.split(' ');
        const firstName = parts[0];
        const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) + '.' : '';
        return `${firstName} ${lastInitial}`.trim();
    };

    // Calculate standings
    const standings = league.players.map(playerId => {
        const playerMatches = league.matches.filter(
            m => (m.player1 === playerId || m.player2 === playerId) && m.played
        );
        let points = 0, setsWon = 0, setsLost = 0, wins = 0, losses = 0;

        playerMatches.forEach(match => {
            const isPlayer1 = match.player1 === playerId;
            const myScore = isPlayer1 ? match.score1 : match.score2;
            const oppScore = isPlayer1 ? match.score2 : match.score1;
            setsWon += myScore;
            setsLost += oppScore;
            if (myScore > oppScore) {
                wins++;
                points += 3;
            } else {
                losses++;
            }
        });

        return { playerId, points, wins, losses, setsWon, setsLost, diff: setsWon - setsLost, played: playerMatches.length };
    }).sort((a, b) => b.points - a.points || b.diff - a.diff);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement de la ligue...</p>
                </div>
            </div>
        );
    }

    const playedMatches = league.matches.filter(m => m.played).length;

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold text-blue-400" style={{ marginBottom: '0.5rem' }}>
                    🏓 Ping-Pong Solo - Ligue
                </h1>
                <p className="text-sm text-text-secondary">
                    {playedMatches}/{league.matches.length} matchs joués
                </p>
            </div>

            {/* Standings Table */}
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden" style={{ marginBottom: '2rem' }}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-800" style={{ padding: '1rem' }}>
                    <h2 className="text-lg font-bold text-white">Classement</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="bg-bg-secondary">
                                <th className="text-left text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>#</th>
                                <th className="text-left text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>Joueur</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>J</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>V</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>D</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>+/-</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((s, idx) => (
                                <tr key={s.playerId} className={`border-t border-border ${idx < 8 ? 'bg-blue-900/20' : ''}`}>
                                    <td className="text-text-primary font-bold" style={{ padding: '0.75rem' }}>
                                        {idx + 1}
                                        {idx < 8 && <span className="text-blue-400 ml-1">★</span>}
                                    </td>
                                    <td className="text-text-primary font-semibold" style={{ padding: '0.75rem' }}>{getPlayerFirstName(s.playerId)}</td>
                                    <td className="text-center text-text-secondary" style={{ padding: '0.75rem' }}>{s.played}</td>
                                    <td className="text-center text-green-400 font-semibold" style={{ padding: '0.75rem' }}>{s.wins}</td>
                                    <td className="text-center text-red-400 font-semibold" style={{ padding: '0.75rem' }}>{s.losses}</td>
                                    <td className={`text-center font-semibold ${s.diff > 0 ? 'text-green-400' : s.diff < 0 ? 'text-red-400' : 'text-text-muted'}`} style={{ padding: '0.75rem' }}>
                                        {s.diff > 0 ? '+' : ''}{s.diff}
                                    </td>
                                    <td className="text-center text-blue-400 font-bold" style={{ padding: '0.75rem' }}>{s.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-bg-secondary text-text-muted text-xs" style={{ padding: '0.5rem 1rem' }}>
                    ★ Top 8 qualifiés pour les Quarts de Finale
                </div>
            </div>

            {/* Match List */}
            <div>
                <div className="flex flex-wrap items-center justify-between" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
                    <h2 className="text-xl font-bold text-text-primary">Matchs</h2>
                    <select
                        value={filterPlayer}
                        onChange={(e) => setFilterPlayer(e.target.value)}
                        className="bg-bg-card text-text-primary border border-border rounded-lg font-semibold"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        <option value="all">Tous les joueurs</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                {league.matches.length === 0 ? (
                    <div className="text-center bg-bg-card border border-border rounded-xl" style={{ padding: '2rem' }}>
                        <p className="text-text-muted">Aucun match programmé</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[...league.matches]
                            .filter(m => filterPlayer === 'all' || m.player1 === filterPlayer || m.player2 === filterPlayer)
                            .sort((a, b) => {
                                if (a.date && b.date) {
                                    const dateCompare = a.date.localeCompare(b.date);
                                    if (dateCompare !== 0) return dateCompare;
                                    if (a.time && b.time) return a.time.localeCompare(b.time);
                                    return 0;
                                }
                                if (a.date && !b.date) return -1;
                                if (!a.date && b.date) return 1;
                                return a.id - b.id;
                            }).map((match) => (
                                <div
                                    key={match.id}
                                    className={`bg-bg-card border border-border rounded-xl match-row ${match.played ? 'opacity-100' : 'opacity-70'}`}
                                    style={{ padding: '1rem' }}
                                >
                                    <div className="flex items-start" style={{ gap: '0.75rem' }}>
                                        {/* Match ID, Time & Date */}
                                        <div style={{ minWidth: '45px', flexShrink: 0 }}>
                                            <div className="text-xs text-text-muted">#{match.id}</div>
                                            <div className="text-blue-400 font-semibold text-xs">{match.time || '-:-'}</div>
                                            <div className="text-xs text-text-muted">{match.date || '-/-'}</div>
                                        </div>

                                        {/* Player 1 */}
                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                                            <span className={`font-semibold text-sm ${match.played && match.score1 > match.score2 ? 'text-green-400' : 'text-text-primary'}`}>
                                                {getPlayerFirstName(match.player1)}
                                            </span>
                                        </div>

                                        {/* VS / Score */}
                                        <div style={{ flexShrink: 0, textAlign: 'center' }}>
                                            {match.played ? (
                                                <span className="font-bold text-text-primary">{match.score1} - {match.score2}</span>
                                            ) : (
                                                <span className="text-text-muted text-sm font-medium">VS</span>
                                            )}
                                        </div>

                                        {/* Player 2 */}
                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                            <span className={`font-semibold text-sm ${match.played && match.score2 > match.score1 ? 'text-green-400' : 'text-text-primary'}`}>
                                                {getPlayerFirstName(match.player2)}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div style={{ flexShrink: 0 }}>
                                            <span className={`text-sm ${match.played ? 'text-green-400' : 'text-text-muted'}`}>
                                                {match.played ? '✓' : '⏳'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
