// Greek letters for team names
const greekLetters = {
    alpha: 'α',
    beta: 'β',
    gamma: 'Γ',
    delta: 'Δ',
    epsilon: 'ε',
    lambda: 'λ',
    sigma: 'Σ',
    omega: 'Ω'
};

export default function TeamCard({ team, index }) {
    const greekLetter = greekLetters[team.id] || team.name.charAt(0);

    return (
        <div
            className="card-hover bg-bg-card border border-border rounded-2xl animate-fadeIn"
            style={{
                animationDelay: `${index * 100}ms`,
                padding: '1.5rem'
            }}
        >
            {/* Team Badge */}
            <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                    className="rounded-xl bg-gradient-to-br from-green-light to-green-dark flex items-center justify-center text-2xl font-bold text-bg-primary"
                    style={{ width: '3.5rem', height: '3.5rem' }}
                >
                    {greekLetter}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-text-primary">{team.name}</h3>
                    <p className="text-sm text-text-muted" style={{ marginTop: '0.25rem' }}>Équipe {team.id.toUpperCase()}</p>
                </div>
            </div>

            {/* Players */}
            <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider" style={{ marginBottom: '1rem' }}>Joueurs</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {team.players.map((player, idx) => (
                        <div
                            key={idx}
                            className="flex items-center bg-bg-secondary rounded-xl"
                            style={{ gap: '0.75rem', padding: '0.75rem 1rem' }}
                        >
                            <div className="rounded-full bg-green-primary" style={{ width: '0.5rem', height: '0.5rem' }}></div>
                            <span className="text-text-primary font-medium">{player}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
