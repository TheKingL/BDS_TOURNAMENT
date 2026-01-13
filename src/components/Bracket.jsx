export default function Bracket({ bracket, teams }) {
    const getTeamName = (teamId) => {
        if (!teamId) return '???';
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    // Match component with optional border for connections
    const MatchBlock = ({ match, borderRight = false, borderLeft = false }) => (
        <div
            className="bg-bg-card border border-border rounded-lg overflow-hidden"
            style={{
                width: '160px',
                flexShrink: 0,
                borderRight: borderRight ? '2px solid #166534' : undefined,
                borderLeft: borderLeft ? '2px solid #166534' : undefined
            }}
        >
            {/* Team 1 */}
            <div
                className={`flex items-center justify-between border-b border-border ${match.played && match.winner === match.team1 ? 'bg-green-darker/40' : ''
                    }`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.team1 ? 'text-green-light' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '100px' }}>
                    {getTeamName(match.team1)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.team1 ? 'text-green-light' : 'text-text-muted'
                    }`}>
                    {match.score1 ?? '-'}
                </span>
            </div>
            {/* Team 2 */}
            <div
                className={`flex items-center justify-between ${match.played && match.winner === match.team2 ? 'bg-green-darker/40' : ''
                    }`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.team2 ? 'text-green-light' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '100px' }}>
                    {getTeamName(match.team2)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.team2 ? 'text-green-light' : 'text-text-muted'
                    }`}>
                    {match.score2 ?? '-'}
                </span>
            </div>
        </div>
    );

    // Final BO3 component
    const FinalBlock = ({ final }) => {
        const team1Wins = final.matches.filter(m => m.played && m.score1 > m.score2).length;
        const team2Wins = final.matches.filter(m => m.played && m.score2 > m.score1).length;

        return (
            <div
                className="bg-gradient-to-br from-green-darker to-bg-card border-2 border-green-primary rounded-xl"
                style={{ padding: '1rem', width: '200px' }}
            >
                <div className="text-center" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-xs font-bold text-green-light uppercase tracking-wider">
                        🏆 Finale BO3 🏆
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div
                        className={`flex items-center justify-between rounded-lg ${final.winner === final.team1 ? 'bg-green-dark/50' : 'bg-bg-secondary'
                            }`}
                        style={{ padding: '0.5rem 0.75rem' }}
                    >
                        <span className={`font-semibold text-sm ${final.winner === final.team1 ? 'text-green-light' : 'text-text-primary'}`}>
                            {getTeamName(final.team1)}
                        </span>
                        <span className="text-lg font-bold text-green-light">{team1Wins}</span>
                    </div>
                    <div
                        className={`flex items-center justify-between rounded-lg ${final.winner === final.team2 ? 'bg-green-dark/50' : 'bg-bg-secondary'
                            }`}
                        style={{ padding: '0.5rem 0.75rem' }}
                    >
                        <span className={`font-semibold text-sm ${final.winner === final.team2 ? 'text-green-light' : 'text-text-primary'}`}>
                            {getTeamName(final.team2)}
                        </span>
                        <span className="text-lg font-bold text-green-light">{team2Wins}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                    {final.matches.map((match, idx) => (
                        <div
                            key={idx}
                            className={`text-center rounded ${match.played ? 'bg-bg-card' : 'bg-bg-secondary'}`}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                        >
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

    // Simple bracket connector shape
    const Connector = ({ direction = 'right', height = 108 }) => (
        <svg width="24" height={height} style={{ display: 'block' }}>
            <path
                d={direction === 'right'
                    ? `M0,2 H12 V${height - 2} H0 M12,${height / 2} H24`
                    : `M24,2 H12 V${height - 2} H24 M12,${height / 2} H0`
                }
                stroke="#166534"
                strokeWidth="2"
                fill="none"
            />
        </svg>
    );

    // Horizontal line
    const HLine = () => (
        <div style={{ width: '16px', height: '2px', backgroundColor: '#166534' }}></div>
    );

    return (
        <div style={{ overflowX: 'auto', padding: '1rem' }}>
            <div style={{ minWidth: '950px' }}>

                {/* Headers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 10px' }}>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Quarts</span>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Demis</span>
                    <span className="text-xs font-bold text-green-primary uppercase" style={{ width: '200px', textAlign: 'center' }}>Finale</span>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Demis</span>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Quarts</span>
                </div>

                {/* Main bracket structure */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* LEFT: QF 1-2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <MatchBlock match={bracket.quarterFinals[0]} />
                        <MatchBlock match={bracket.quarterFinals[1]} />
                    </div>

                    {/* Connector QF -> SF left */}
                    <Connector direction="right" />

                    {/* LEFT: SF 1 */}
                    <MatchBlock match={bracket.semiFinals[0]} />

                    {/* Line to final */}
                    <HLine />

                    {/* CENTER: Finale + 3rd place */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <FinalBlock final={bracket.final} />

                        <div>
                            <div className="text-center" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-xs text-text-muted">🥉 3ème place</span>
                            </div>
                            <MatchBlock match={bracket.thirdPlace} />
                        </div>
                    </div>

                    {/* Line from final */}
                    <HLine />

                    {/* RIGHT: SF 2 */}
                    <MatchBlock match={bracket.semiFinals[1]} />

                    {/* Connector QF -> SF right */}
                    <Connector direction="left" />

                    {/* RIGHT: QF 3-4 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <MatchBlock match={bracket.quarterFinals[2]} />
                        <MatchBlock match={bracket.quarterFinals[3]} />
                    </div>
                </div>
            </div>
        </div>
    );
}
