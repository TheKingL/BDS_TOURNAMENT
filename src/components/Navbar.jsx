import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navItems = [
        { path: '/', label: 'Équipes', icon: '👥' },
        { path: '/pools', label: 'Poules', icon: '📊' },
        { path: '/bracket', label: 'Bracket', icon: '🏆' },
    ];

    return (
        <nav className="glass sticky top-0 z-50 border-b border-border">
            <div style={{ padding: '0 1rem' }}>
                <div className="flex items-center justify-between" style={{ height: '4rem' }}>
                    {/* Logo text - links to home */}
                    <NavLink to="/" className="text-lg sm:text-2xl font-extrabold gradient-text tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap">
                        BDS TOURNAMENT
                    </NavLink>

                    {/* Navigation - icons on mobile, icons + text on desktop */}
                    <div className="flex items-center" style={{ gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${isActive
                                        ? 'bg-green-primary text-bg-primary shadow-lg shadow-green-primary/30'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                                    }`
                                }
                                style={{
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="hidden sm:inline">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
