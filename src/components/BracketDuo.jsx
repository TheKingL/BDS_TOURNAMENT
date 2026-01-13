// Bracket component for Ping-Pong Duo (teams, SF→F - no quarter finals!)
export default function BracketDuo({ bracket, teams }) {
    const getTeamName = (teamId) => {
        if (!teamId) return '???';
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    // Match component
    const MatchBlock = ({ match }) => (
        <div className="bg-bg-card border border-border rounded-lg overflow-hidden" style={{ width: '180px', flexShrink: 0 }}>
            {/* Team 1 */}
            <div
                className={`flex items-center justify-between border-b border-border ${match.played && match.winner === match.team1 ? 'bg-purple-900/40' : ''}`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.team1 ? 'text-purple-400' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '120px' }}>
                    {getTeamName(match.team1)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.team1 ? 'text-purple-400' : 'text-text-muted'}`}>
                    {match.score1 ?? '-'}
                </span>
            </div>
            {/* Team 2 */}
            <div
                className={`flex items-center justify-between ${match.played && match.winner === match.team2 ? 'bg-purple-900/40' : ''}`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.team2 ? 'text-purple-400' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '120px' }}>
                    {getTeamName(match.team2)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.team2 ? 'text-purple-400' : 'text-text-muted'}`}>
                    {match.score2 ?? '-'}
                </span>
            </div>
        </div>
    );

    // Final BO3 component
    const FinalBlock = ({ final }) => {
        const t1Wins = final.matches.filter(m => m.played && m.score1 > m.score2).length;
        const t2Wins = final.matches.filter(m => m.played && m.score2 > m.score1).length;

        return (
            <div
                className="bg-gradient-to-br from-purple-900 to-bg-card border-2 border-purple-500 rounded-xl"
                style={{ padding: '1rem', width: '220px' }}
            >
                <div className="text-center" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        🏆 Finale BO5 🏆
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div className={`flex items-center justify-between rounded-lg ${final.winner === final.team1 ? 'bg-purple-800/50' : 'bg-bg-secondary'}`} style={{ padding: '0.5rem 0.75rem' }}>
                        <span className={`font-semibold text-sm ${final.winner === final.team1 ? 'text-purple-400' : 'text-text-primary'}`}>
                            {getTeamName(final.team1)}
                        </span>
                        <span className="text-lg font-bold text-purple-400">{t1Wins}</span>
                    </div>
                    <div className={`flex items-center justify-between rounded-lg ${final.winner === final.team2 ? 'bg-purple-800/50' : 'bg-bg-secondary'}`} style={{ padding: '0.5rem 0.75rem' }}>
                        <span className={`font-semibold text-sm ${final.winner === final.team2 ? 'text-purple-400' : 'text-text-primary'}`}>
                            {getTeamName(final.team2)}
                        </span>
                        <span className="text-lg font-bold text-purple-400">{t2Wins}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                    {final.matches.map((match, idx) => (
                        <div key={idx} className={`text-center rounded ${match.played ? 'bg-bg-card' : 'bg-bg-secondary'}`} style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                            {match.played ? (
                                <span className="font-medium text-text-primary">{match.score1}-{match.score2}</span>
                            ) : (
                                <span className="text-text-muted">M{idx + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const HLine = () => (
        <div style={{ width: '24px', height: '2px', backgroundColor: '#a855f7' }}></div>
    );

    return (
        <div style={{ overflowX: 'auto', padding: '1rem' }}>
            <div style={{ minWidth: '700px' }}>
                {/* Headers - NO QUARTS for Duo! */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 10px' }}>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '180px', textAlign: 'center' }}>Demi-Finale</span>
                    <span className="text-xs font-bold text-purple-400 uppercase" style={{ width: '220px', textAlign: 'center' }}>Finale</span>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '180px', textAlign: 'center' }}>Demi-Finale</span>
                </div>

                {/* Main bracket structure - Duo starts at SF! */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* LEFT: SF 1 */}
                    <MatchBlock match={bracket.semiFinals[0]} />

                    <HLine />

                    {/* CENTER */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <FinalBlock final={bracket.final} />
                        <div>
                            <div className="text-center" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-xs text-text-muted">🥉 3ème place</span>
                            </div>
                            <MatchBlock match={bracket.thirdPlace} />
                        </div>
                    </div>

                    <HLine />

                    {/* RIGHT: SF 2 */}
                    <MatchBlock match={bracket.semiFinals[1]} />
                </div>
            </div>
        </div>
    );
}
