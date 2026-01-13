import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(null);
    const location = useLocation();

    const tournaments = [
        {
            id: 'babyfoot',
            name: 'Babyfoot',
            icon: '⚽',
            color: 'green',
            basePath: '/babyfoot',
            links: [
                { path: '/babyfoot', label: 'Équipes', exact: true },
                { path: '/babyfoot/poules', label: 'Poules' },
                { path: '/babyfoot/bracket', label: 'Bracket' }
            ]
        },
        {
            id: 'pingpong-solo',
            name: 'Solo',
            icon: '🏓',
            color: 'blue',
            basePath: '/pingpong-solo',
            links: [
                { path: '/pingpong-solo', label: 'Joueurs', exact: true },
                { path: '/pingpong-solo/ligue', label: 'Ligue' },
                { path: '/pingpong-solo/bracket', label: 'Bracket' }
            ]
        },
        {
            id: 'pingpong-duo',
            name: 'Duo',
            icon: '🏓',
            color: 'purple',
            basePath: '/pingpong-duo',
            links: [
                { path: '/pingpong-duo', label: 'Équipes', exact: true },
                { path: '/pingpong-duo/ligue', label: 'Ligue' },
                { path: '/pingpong-duo/bracket', label: 'Bracket' }
            ]
        }
    ];

    const isInTournament = (basePath) => location.pathname.startsWith(basePath);

    const getButtonColor = (t, isActive) => {
        if (!isActive) return 'text-text-secondary hover:text-text-primary hover:bg-bg-card';
        if (t.color === 'green') return 'bg-green-primary text-bg-primary';
        if (t.color === 'blue') return 'bg-blue-500 text-white';
        if (t.color === 'purple') return 'bg-purple-500 text-white';
        return 'bg-green-primary text-bg-primary';
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-border">
            <div style={{ padding: '0 1rem' }}>
                <div className="flex items-center justify-between" style={{ height: '60px' }}>
                    {/* Logo */}
                    <NavLink to="/" className="font-bold text-lg text-text-primary hover:text-green-light transition-colors">
                        🏆 BDS
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center" style={{ gap: '0.25rem' }}>
                        {tournaments.map((t) => (
                            <div key={t.id} className="relative">
                                <button
                                    onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                                    className={`flex items-center font-semibold text-sm transition-all rounded-lg ${getButtonColor(t, isInTournament(t.basePath))}`}
                                    style={{ padding: '0.5rem 0.75rem', gap: '0.375rem' }}
                                >
                                    <span>{t.icon}</span>
                                    <span>{t.name}</span>
                                    <span className="text-xs">▾</span>
                                </button>

                                {/* Dropdown */}
                                {openMenu === t.id && (
                                    <div
                                        className="absolute top-full right-0 mt-1 bg-bg-card border border-border rounded-xl shadow-xl z-50"
                                        style={{ minWidth: '140px', padding: '0.5rem' }}
                                    >
                                        {t.links.map((link) => (
                                            <NavLink
                                                key={link.path}
                                                to={link.path}
                                                end={link.exact}
                                                onClick={() => setOpenMenu(null)}
                                                className={({ isActive }) =>
                                                    `block text-sm font-medium rounded-lg transition-all ${isActive
                                                        ? t.color === 'green' ? 'bg-green-darker text-green-light'
                                                            : t.color === 'blue' ? 'bg-blue-900 text-blue-400'
                                                                : 'bg-purple-900 text-purple-400'
                                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                                    }`
                                                }
                                                style={{ padding: '0.5rem 0.75rem' }}
                                            >
                                                {link.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Nav - Tournament icons */}
                    <div className="md:hidden flex items-center" style={{ gap: '0.5rem' }}>
                        {tournaments.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${isInTournament(t.basePath)
                                    ? t.color === 'green' ? 'bg-green-primary'
                                        : t.color === 'blue' ? 'bg-blue-500'
                                            : 'bg-purple-500'
                                    : 'bg-bg-card text-text-secondary'
                                    }`}
                            >
                                {t.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {openMenu && (
                    <div className="md:hidden bg-bg-card border border-border rounded-xl shadow-xl" style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                        {tournaments.find(t => t.id === openMenu)?.links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.exact}
                                onClick={() => setOpenMenu(null)}
                                className={({ isActive }) => {
                                    const t = tournaments.find(t => t.id === openMenu);
                                    return `block text-sm font-medium rounded-lg transition-all ${isActive
                                        ? t?.color === 'green' ? 'bg-green-darker text-green-light'
                                            : t?.color === 'blue' ? 'bg-blue-900 text-blue-400'
                                                : 'bg-purple-900 text-purple-400'
                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                        }`;
                                }}
                                style={{ padding: '0.75rem 1rem' }}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>

            {/* Click outside to close */}
            {openMenu && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setOpenMenu(null)}
                />
            )}
        </nav>
    );
}
