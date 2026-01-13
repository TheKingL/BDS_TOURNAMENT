// Bracket component for Ping-Pong Solo (players, QF→SF→F)
export default function BracketSolo({ bracket, players }) {
    const getPlayerName = (playerId) => {
        if (!playerId) return '???';
        const player = players.find(p => p.id === playerId);
        return player ? player.name : playerId;
    };

    // Match component
    const MatchBlock = ({ match, borderRight = false, borderLeft = false }) => (
        <div
            className="bg-bg-card border border-border rounded-lg overflow-hidden"
            style={{
                width: '160px',
                flexShrink: 0,
                borderRight: borderRight ? '2px solid #3b82f6' : undefined,
                borderLeft: borderLeft ? '2px solid #3b82f6' : undefined
            }}
        >
            {/* Player 1 */}
            <div
                className={`flex items-center justify-between border-b border-border ${match.played && match.winner === match.player1 ? 'bg-blue-900/40' : ''}`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.player1 ? 'text-blue-400' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '100px' }}>
                    {getPlayerName(match.player1)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.player1 ? 'text-blue-400' : 'text-text-muted'}`}>
                    {match.score1 ?? '-'}
                </span>
            </div>
            {/* Player 2 */}
            <div
                className={`flex items-center justify-between ${match.played && match.winner === match.player2 ? 'bg-blue-900/40' : ''}`}
                style={{ padding: '0.5rem 0.75rem' }}
            >
                <span className={`font-medium text-sm truncate ${match.played
                    ? match.winner === match.player2 ? 'text-blue-400' : 'text-red-400'
                    : 'text-text-primary'
                    }`} style={{ maxWidth: '100px' }}>
                    {getPlayerName(match.player2)}
                </span>
                <span className={`font-bold text-sm ${match.played && match.winner === match.player2 ? 'text-blue-400' : 'text-text-muted'}`}>
                    {match.score2 ?? '-'}
                </span>
            </div>
        </div>
    );

    // Final BO3 component
    const FinalBlock = ({ final }) => {
        const p1Wins = final.matches.filter(m => m.played && m.score1 > m.score2).length;
        const p2Wins = final.matches.filter(m => m.played && m.score2 > m.score1).length;

        return (
            <div
                className="bg-gradient-to-br from-blue-900 to-bg-card border-2 border-blue-500 rounded-xl"
                style={{ padding: '1rem', width: '200px' }}
            >
                <div className="text-center" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        🏆 Finale BO5 🏆
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div className={`flex items-center justify-between rounded-lg ${final.winner === final.player1 ? 'bg-blue-800/50' : 'bg-bg-secondary'}`} style={{ padding: '0.5rem 0.75rem' }}>
                        <span className={`font-semibold text-sm ${final.winner === final.player1 ? 'text-blue-400' : 'text-text-primary'}`}>
                            {getPlayerName(final.player1)}
                        </span>
                        <span className="text-lg font-bold text-blue-400">{p1Wins}</span>
                    </div>
                    <div className={`flex items-center justify-between rounded-lg ${final.winner === final.player2 ? 'bg-blue-800/50' : 'bg-bg-secondary'}`} style={{ padding: '0.5rem 0.75rem' }}>
                        <span className={`font-semibold text-sm ${final.winner === final.player2 ? 'text-blue-400' : 'text-text-primary'}`}>
                            {getPlayerName(final.player2)}
                        </span>
                        <span className="text-lg font-bold text-blue-400">{p2Wins}</span>
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

    const Connector = ({ direction = 'right', height = 108 }) => (
        <svg width="24" height={height} style={{ display: 'block' }}>
            <path
                d={direction === 'right'
                    ? `M0,2 H12 V${height - 2} H0 M12,${height / 2} H24`
                    : `M24,2 H12 V${height - 2} H24 M12,${height / 2} H0`
                }
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
            />
        </svg>
    );

    const HLine = () => (
        <div style={{ width: '16px', height: '2px', backgroundColor: '#3b82f6' }}></div>
    );

    return (
        <div style={{ overflowX: 'auto', padding: '1rem' }}>
            <div style={{ minWidth: '950px' }}>
                {/* Headers */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 10px' }}>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Quarts</span>
                    <span className="text-xs font-bold text-text-muted uppercase" style={{ width: '160px', textAlign: 'center' }}>Demis</span>
                    <span className="text-xs font-bold text-blue-400 uppercase" style={{ width: '200px', textAlign: 'center' }}>Finale</span>
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

                    <Connector direction="right" />
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
                    <MatchBlock match={bracket.semiFinals[1]} />
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
