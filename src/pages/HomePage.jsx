import { Link } from 'react-router-dom';

export default function HomePage() {
    const tournaments = [
        {
            id: 'babyfoot',
            name: 'Babyfoot',
            icon: '⚽',
            description: 'Tournoi en duo - 8 équipes',
            format: '2 poules → Quarts → Demis → Finale BO3',
            color: 'from-green-600 to-green-800',
            link: '/babyfoot'
        },
        {
            id: 'pingpong-solo',
            name: 'Ping-Pong Solo',
            icon: '🏓',
            description: 'Tournoi individuel',
            format: 'Ligue → Top 8 en Quarts → Finale BO3',
            color: 'from-blue-600 to-blue-800',
            link: '/pingpong-solo'
        },
        {
            id: 'pingpong-duo',
            name: 'Ping-Pong Duo',
            icon: '🏓',
            description: 'Tournoi en équipe - 7 équipes',
            format: 'Ligue → Top 4 en Demis → Finale BO3',
            color: 'from-purple-600 to-purple-800',
            link: '/pingpong-duo'
        }
    ];

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text" style={{ marginBottom: '1rem' }}>
                    🏆 BDS Tournament
                </h1>
                <p className="text-lg text-text-secondary">
                    Tournois de Janvier 2026
                </p>
            </div>

            {/* Tournament Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                {tournaments.map((t, idx) => (
                    <Link
                        key={t.id}
                        to={t.link}
                        className="bg-bg-card border border-border rounded-2xl transition-all hover:scale-105 hover:border-green-dark animate-fadeIn"
                        style={{
                            padding: '2rem',
                            animationDelay: `${idx * 100}ms`,
                            textDecoration: 'none'
                        }}
                    >
                        {/* Icon */}
                        <div
                            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto`}
                            style={{ marginBottom: '1.5rem', fontSize: '2rem' }}
                        >
                            {t.icon}
                        </div>

                        {/* Name */}
                        <h2 className="text-xl font-bold text-text-primary text-center" style={{ marginBottom: '0.5rem' }}>
                            {t.name}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-text-secondary text-center" style={{ marginBottom: '1rem' }}>
                            {t.description}
                        </p>

                        {/* Format */}
                        <div className="bg-bg-secondary rounded-lg" style={{ padding: '0.75rem' }}>
                            <p className="text-xs text-text-muted text-center">
                                {t.format}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="text-center text-green-primary" style={{ marginTop: '1rem' }}>
                            Voir →
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer Info */}
            <div className="text-center" style={{ marginTop: '3rem' }}>
                <p className="text-sm text-text-muted">
                    Organisé par le BDS ESIGELEC
                </p>
            </div>
        </div>
    );
}
