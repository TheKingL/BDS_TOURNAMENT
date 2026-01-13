import { Link } from 'react-router-dom';

const errorMessages = {
    400: { title: 'Requête invalide', message: 'La requête envoyée est incorrecte.', emoji: '❌' },
    401: { title: 'Non autorisé', message: 'Tu dois être connecté pour accéder à cette page.', emoji: '🔐' },
    403: { title: 'Accès interdit', message: 'Tu n\'as pas les droits pour accéder à cette page.', emoji: '🚫' },
    404: { title: 'Page non trouvée', message: 'Cette page n\'existe pas ou a été déplacée.', emoji: '🔍' },
    500: { title: 'Erreur serveur', message: 'Une erreur interne s\'est produite.', emoji: '💥' },
    503: { title: 'Service indisponible', message: 'Le service est temporairement indisponible.', emoji: '🔧' },
};

export default function ErrorPage({ code = 404 }) {
    const error = errorMessages[code] || errorMessages[404];

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center" style={{ padding: '2rem' }}>
                {/* Error Code */}
                <div className="text-8xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>
                    {code}
                </div>

                {/* Emoji */}
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {error.emoji}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-text-primary" style={{ marginBottom: '0.5rem' }}>
                    {error.title}
                </h1>

                {/* Message */}
                <p className="text-text-secondary" style={{ marginBottom: '2rem', maxWidth: '350px', margin: '0 auto 2rem' }}>
                    {error.message}
                </p>

                {/* Back button */}
                <Link
                    to="/"
                    className="inline-block bg-green-primary text-bg-primary font-bold rounded-xl transition-all hover:bg-green-light"
                    style={{ padding: '0.875rem 1.75rem' }}
                >
                    🏠 Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
