import { useState, useEffect } from 'react';

export default function LiguePage() {
    const [teams, setTeams] = useState([]);
    const [league, setLeague] = useState({ teams: [], matches: [] });
    const [loading, setLoading] = useState(true);
    const [filterTeam, setFilterTeam] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/league.json`).then(res => res.json())
        ])
            .then(([teamsData, leagueData]) => {
                setTeams(teamsData);
                setLeague(leagueData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setLoading(false);
            });
    }, []);

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    // Get first names with last name initial (e.g. "Théo T. & Maëlle C.")
    const getTeamFirstNames = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team?.players) return '';
        return team.players.map(p => {
            const parts = p.split(' ');
            const firstName = parts[0];
            const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) + '.' : '';
            return `${firstName} ${lastInitial}`.trim();
        }).join(' & ');
    };

    // Calculate standings
    const standings = league.teams.map(teamId => {
        const teamMatches = league.matches.filter(
            m => (m.team1 === teamId || m.team2 === teamId) && m.played
        );
        let points = 0, setsWon = 0, setsLost = 0, wins = 0, losses = 0;

        teamMatches.forEach(match => {
            const isTeam1 = match.team1 === teamId;
            const myScore = isTeam1 ? match.score1 : match.score2;
            const oppScore = isTeam1 ? match.score2 : match.score1;
            setsWon += myScore;
            setsLost += oppScore;
            if (myScore > oppScore) {
                wins++;
                points += 3;
            } else {
                losses++;
            }
        });

        return { teamId, points, wins, losses, setsWon, setsLost, diff: setsWon - setsLost, played: teamMatches.length };
    }).sort((a, b) => b.points - a.points || b.diff - a.diff);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
                <h1 className="text-3xl font-bold text-purple-400" style={{ marginBottom: '0.5rem' }}>
                    🏓 Ping-Pong Duo - Ligue
                </h1>
                <p className="text-sm text-text-secondary">
                    {playedMatches}/{league.matches.length} matchs joués
                </p>
            </div>

            {/* Standings Table */}
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden" style={{ marginBottom: '2rem' }}>
                <div className="bg-gradient-to-r from-purple-600 to-purple-800" style={{ padding: '1rem' }}>
                    <h2 className="text-lg font-bold text-white">Classement</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="bg-bg-secondary">
                                <th className="text-left text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>#</th>
                                <th className="text-left text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>Équipe</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>J</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>V</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>D</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>+/-</th>
                                <th className="text-center text-text-muted text-xs font-semibold" style={{ padding: '0.75rem' }}>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((s, idx) => (
                                <tr key={s.teamId} className={`border-t border-border ${idx < 4 ? 'bg-purple-900/20' : ''}`}>
                                    <td className="text-text-primary font-bold" style={{ padding: '0.75rem' }}>
                                        {idx + 1}
                                        {idx < 4 && <span className="text-purple-400 ml-1">★</span>}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div className="text-text-primary font-semibold">{getTeamName(s.teamId)}</div>
                                        <div className="text-xs text-text-muted">{getTeamFirstNames(s.teamId)}</div>
                                    </td>
                                    <td className="text-center text-text-secondary" style={{ padding: '0.75rem' }}>{s.played}</td>
                                    <td className="text-center text-green-400 font-semibold" style={{ padding: '0.75rem' }}>{s.wins}</td>
                                    <td className="text-center text-red-400 font-semibold" style={{ padding: '0.75rem' }}>{s.losses}</td>
                                    <td className={`text-center font-semibold ${s.diff > 0 ? 'text-green-400' : s.diff < 0 ? 'text-red-400' : 'text-text-muted'}`} style={{ padding: '0.75rem' }}>
                                        {s.diff > 0 ? '+' : ''}{s.diff}
                                    </td>
                                    <td className="text-center text-purple-400 font-bold" style={{ padding: '0.75rem' }}>{s.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-bg-secondary text-text-muted text-xs" style={{ padding: '0.5rem 1rem' }}>
                    ★ Top 4 qualifiés pour les Demi-Finales
                </div>
            </div>

            {/* Match List */}
            <div>
                <div className="flex flex-wrap items-center justify-between" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
                    <h2 className="text-xl font-bold text-text-primary">Matchs</h2>
                    <select
                        value={filterTeam}
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className="bg-bg-card text-text-primary border border-border rounded-lg font-semibold"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        <option value="all">Toutes les équipes</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
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
                            .filter(m => filterTeam === 'all' || m.team1 === filterTeam || m.team2 === filterTeam)
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
                                    <div className="flex items-start" style={{ gap: '1rem' }}>
                                        {/* Match ID, Time & Date */}
                                        <div style={{ minWidth: '60px' }}>
                                            <div className="text-xs text-text-muted">#{match.id}</div>
                                            <div className="text-purple-400 font-semibold text-xs">{match.time || '-:-'}</div>
                                            <div className="text-xs text-text-muted">{match.date || '-/-'}</div>
                                        </div>

                                        {/* Team 1 */}
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <div className={`font-semibold ${match.played && match.score1 > match.score2 ? 'text-green-400' : 'text-text-primary'}`}>
                                                {getTeamName(match.team1)}
                                            </div>
                                            <div className="text-xs text-text-muted">{getTeamFirstNames(match.team1)}</div>
                                        </div>

                                        {/* VS / Score */}
                                        <div style={{ minWidth: '50px', textAlign: 'center' }}>
                                            {match.played ? (
                                                <span className="font-bold text-text-primary">{match.score1} - {match.score2}</span>
                                            ) : (
                                                <span className="text-text-muted text-sm font-medium">VS</span>
                                            )}
                                        </div>

                                        {/* Team 2 */}
                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                            <div className={`font-semibold ${match.played && match.score2 > match.score1 ? 'text-green-400' : 'text-text-primary'}`}>
                                                {getTeamName(match.team2)}
                                            </div>
                                            <div className="text-xs text-text-muted">{getTeamFirstNames(match.team2)}</div>
                                        </div>

                                        {/* Status */}
                                        <div style={{ minWidth: '24px', textAlign: 'center' }}>
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
