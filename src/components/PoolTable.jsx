export default function PoolTable({ pool, teams, matches }) {
    // Calculate standings
    const standings = pool.teams.map(teamId => {
        const team = teams.find(t => t.id === teamId);
        const teamMatches = matches.filter(
            m => m.pool === pool.id && (m.team1 === teamId || m.team2 === teamId) && m.played
        );

        let points = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;

        teamMatches.forEach(match => {
            const isTeam1 = match.team1 === teamId;
            const scored = isTeam1 ? match.score1 : match.score2;
            const conceded = isTeam1 ? match.score2 : match.score1;

            goalsFor += scored || 0;
            goalsAgainst += conceded || 0;

            if (scored > conceded) {
                wins++;
                points += 3;
            } else if (scored === conceded) {
                draws++;
                points += 2;
            } else if (scored === 0 && conceded === 3 && match.forfeit) {
                points += 0;
                losses++;
            } else {
                losses++;
                points += 1;
            }
        });

        return {
            team,
            played: teamMatches.length,
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            goalDiff: goalsFor - goalsAgainst,
            points
        };
    }).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        return b.goalsFor - a.goalsFor;
    });

    return (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-green-dark to-green-darker"
                style={{ padding: '0.75rem 1rem' }}
            >
                <h3 className="text-lg font-bold text-text-primary">{pool.name}</h3>
            </div>

            {/* Table - scrollable on mobile */}
            <div style={{ overflowX: 'auto' }}>
                <table className="w-full" style={{ minWidth: '400px', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr className="bg-bg-secondary text-text-muted text-xs">
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 500 }}>#</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 500 }}>Équipe</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 500 }}>J</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 500 }}>V</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 500 }}>N</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 500 }}>D</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 500 }}>+/-</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 600 }}>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((row, idx) => (
                            <tr
                                key={row.team.id}
                                className={`border-t border-border transition-colors hover:bg-bg-card-hover ${idx < 2 ? 'bg-green-darker/20' : ''}`}
                            >
                                <td style={{ padding: '0.5rem' }}>
                                    <span
                                        className={`flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-green-primary text-bg-primary' :
                                                idx === 1 ? 'bg-green-dark text-text-primary' :
                                                    'bg-bg-secondary text-text-muted'
                                            }`}
                                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', fontSize: '0.7rem' }}
                                    >
                                        {idx + 1}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }} className="text-text-primary">
                                    {row.team.name}
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }} className="text-text-secondary">{row.played}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }} className="text-green-light font-medium">{row.wins}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }} className="text-text-secondary">{row.draws}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }} className="text-red-400 font-medium">{row.losses}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                                    <span className={row.goalDiff > 0 ? 'text-green-light font-medium' : row.goalDiff < 0 ? 'text-red-400 font-medium' : 'text-text-secondary'}>
                                        {row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <span className="font-bold text-base text-green-light">{row.points}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
