// Reusable team card component for Babyfoot and Ping-Pong Duo

// Greek letters for babyfoot team names
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

// Color themes per tournament
const themes = {
    babyfoot: {
        gradient: 'from-green-light to-green-dark',
        accent: 'bg-green-primary',
        text: 'text-green-light'
    },
    duo: {
        gradient: 'from-purple-500 to-purple-700',
        accent: 'bg-purple-500',
        text: 'text-purple-400'
    }
};

export default function TeamCard({ team, index, variant = 'babyfoot' }) {
    const theme = themes[variant] || themes.babyfoot;

    // For babyfoot: use greek letter, for duo: use team number
    const getBadge = () => {
        if (variant === 'babyfoot') {
            return greekLetters[team.id] || team.name.charAt(0);
        }
        // For duo, extract number from team name or id
        const num = team.id.replace('team', '') || (index + 1);
        return num;
    };

    return (
        <div
            className="card-hover bg-bg-card border border-border rounded-2xl animate-fadeIn"
            style={{
                animationDelay: `${index * 100}ms`,
                padding: '1.25rem'
            }}
        >
            {/* Team Badge */}
            <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div
                    className={`rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-xl font-bold text-white`}
                    style={{ width: '3rem', height: '3rem', flexShrink: 0 }}
                >
                    {getBadge()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="text-lg font-bold text-text-primary truncate">{team.name}</h3>
                    {variant === 'babyfoot' && (
                        <p className="text-xs text-text-muted truncate">Équipe {team.id.toUpperCase()}</p>
                    )}
                </div>
            </div>

            {/* Players */}
            <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider" style={{ marginBottom: '0.75rem' }}>Joueurs</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {team.players.map((player, idx) => (
                        <div
                            key={idx}
                            className="flex items-center bg-bg-secondary rounded-lg"
                            style={{ gap: '0.5rem', padding: '0.5rem 0.75rem' }}
                        >
                            <div className={`rounded-full ${theme.accent}`} style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }}></div>
                            <span className="text-text-primary font-medium text-sm truncate">{player}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
