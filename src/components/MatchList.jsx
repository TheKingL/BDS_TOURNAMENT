export default function MatchList({ matches, teams, poolId }) {
    const filteredMatches = poolId
        ? matches.filter(m => m.pool === poolId)
        : matches;

    // Sort: matches with dates first (earliest first), then matches without dates by ID
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        // Both have dates: sort by date then time
        if (a.date && b.date) {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            if (a.time && b.time) return a.time.localeCompare(b.time);
            return 0;
        }
        // Only a has date: a first
        if (a.date && !b.date) return -1;
        // Only b has date: b first
        if (!a.date && b.date) return 1;
        // Neither has date: sort by id
        return a.id - b.id;
    });

    const getTeam = (teamId) => {
        return teams.find(t => t.id === teamId);
    };

    const getTeamName = (teamId) => {
        const team = getTeam(teamId);
        return team ? team.name : teamId;
    };

    // Get first names with last initial (e.g. "Théo T. & Axel S.")
    const getFirstNames = (teamId) => {
        const team = getTeam(teamId);
        if (!team || !team.players) return '';
        return team.players.map(p => {
            const parts = p.split(' ');
            const firstName = parts[0];
            const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) + '.' : '';
            return `${firstName} ${lastInitial}`.trim();
        }).join(' & ');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedMatches.map((match) => (
                <div
                    key={match.id}
                    className={`bg-bg-card border border-border rounded-xl transition-all ${match.played ? 'opacity-100' : 'opacity-70'}`}
                    style={{ padding: '1rem' }}
                >
                    <div className="flex items-center" style={{ gap: '0.75rem' }}>
                        {/* Match ID, Time & Date */}
                        <div style={{ minWidth: '60px' }}>
                            <div className="text-xs text-text-muted">#{match.id}</div>
                            <div className="text-green-primary font-semibold text-xs">{match.time || '-:-'}</div>
                            <div className="text-xs text-text-muted">{match.date ? new Date(match.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '-/-'}</div>
                        </div>

                        {/* Team 1 */}
                        <div style={{ flex: 1, textAlign: 'right' }}>
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

                        {/* Score / VS */}
                        <div style={{ minWidth: '50px', textAlign: 'center' }}>
                            {match.played ? (
                                <div className="flex items-center justify-center" style={{ gap: '0.25rem' }}>
                                    <span className={`font-bold ${match.score1 > match.score2 ? 'text-green-light' : match.score1 < match.score2 ? 'text-red-400' : 'text-amber-400'}`}>
                                        {match.score1}
                                    </span>
                                    <span className="text-text-muted">-</span>
                                    <span className={`font-bold ${match.score2 > match.score1 ? 'text-green-light' : match.score2 < match.score1 ? 'text-red-400' : 'text-amber-400'}`}>
                                        {match.score2}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm font-medium text-text-muted">VS</span>
                            )}
                        </div>

                        {/* Team 2 */}
                        <div style={{ flex: 1, textAlign: 'left' }}>
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

                        {/* Status - Desktop */}
                        <div className="hidden sm:block" style={{ minWidth: '60px', textAlign: 'right' }}>
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

                        {/* Status - Mobile */}
                        <div className="sm:hidden" style={{ minWidth: '24px', textAlign: 'center' }}>
                            <span className={`text-sm ${match.played ? 'text-green-400' : 'text-text-muted'}`}>
                                {match.played ? '✓' : '⏳'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
