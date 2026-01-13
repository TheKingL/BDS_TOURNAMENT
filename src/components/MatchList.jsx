export default function MatchList({ matches, teams, poolId }) {
    const filteredMatches = poolId
        ? matches.filter(m => m.pool === poolId)
        : matches;

    const getTeam = (teamId) => {
        return teams.find(t => t.id === teamId);
    };

    const getTeamName = (teamId) => {
        const team = getTeam(teamId);
        return team ? team.name : teamId;
    };

    // Get first names only (first word of each name)
    const getFirstNames = (teamId) => {
        const team = getTeam(teamId);
        if (!team || !team.players) return '';
        return team.players.map(p => p.split(' ')[0]).join(' & ');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredMatches.map((match) => (
                <div
                    key={match.id}
                    className={`bg-bg-card border border-border rounded-xl transition-all ${match.played ? 'opacity-100' : 'opacity-70'}`}
                    style={{ padding: '0.75rem 1rem' }}
                >
                    {/* Row layout */}
                    <div className="flex items-center justify-between">
                        {/* Left: Match info */}
                        <div className="flex items-center" style={{ gap: '0.5rem', minWidth: '80px' }}>
                            <span className="text-xs text-text-muted">#{match.id}</span>
                            <span className="text-green-primary font-semibold text-xs">{match.time}</span>
                        </div>

                        {/* Center: Teams and Score */}
                        <div className="flex items-center justify-center flex-1" style={{ gap: '1rem' }}>
                            {/* Team 1 */}
                            <div style={{ textAlign: 'right', minWidth: '140px' }}>
                                <div className={`font-semibold ${match.played
                                        ? match.score1 > match.score2 ? 'text-green-light'
                                            : match.score1 < match.score2 ? 'text-red-400'
                                                : 'text-amber-400'
                                        : 'text-text-primary'
                                    }`}>
                                    {getTeamName(match.team1)}
                                </div>
                                <div className="text-xs text-text-muted">
                                    {getFirstNames(match.team1)}
                                </div>
                            </div>

                            {/* Score */}
                            <div style={{ minWidth: '60px', textAlign: 'center' }}>
                                {match.played ? (
                                    <div className="flex items-center justify-center" style={{ gap: '0.25rem' }}>
                                        <span className={`text-lg font-bold ${match.score1 > match.score2 ? 'text-green-light' : match.score1 < match.score2 ? 'text-red-400' : 'text-amber-400'}`}>
                                            {match.score1}
                                        </span>
                                        <span className="text-text-muted">-</span>
                                        <span className={`text-lg font-bold ${match.score2 > match.score1 ? 'text-green-light' : match.score2 < match.score1 ? 'text-red-400' : 'text-amber-400'}`}>
                                            {match.score2}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-bold text-text-muted">VS</span>
                                )}
                            </div>

                            {/* Team 2 */}
                            <div style={{ textAlign: 'left', minWidth: '140px' }}>
                                <div className={`font-semibold ${match.played
                                        ? match.score2 > match.score1 ? 'text-green-light'
                                            : match.score2 < match.score1 ? 'text-red-400'
                                                : 'text-amber-400'
                                        : 'text-text-primary'
                                    }`}>
                                    {getTeamName(match.team2)}
                                </div>
                                <div className="text-xs text-text-muted">
                                    {getFirstNames(match.team2)}
                                </div>
                            </div>
                        </div>

                        {/* Right: Status */}
                        <div style={{ minWidth: '70px', textAlign: 'right' }}>
                            {match.played ? (
                                <span className="bg-green-darker text-green-light text-xs font-medium" style={{ padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                    Terminé
                                </span>
                            ) : (
                                <span className="bg-bg-secondary text-text-muted text-xs font-medium" style={{ padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                    À venir
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
