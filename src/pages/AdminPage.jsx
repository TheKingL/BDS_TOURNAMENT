import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [teams, setTeams] = useState([]);
    const [poolsData, setPoolsData] = useState({ pools: [], matches: [] });
    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('matches');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetch(`${import.meta.env.BASE_URL}data/teams.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/pools.json`).then(res => res.json()),
            fetch(`${import.meta.env.BASE_URL}data/bracket.json`).then(res => res.json())
        ])
            .then(([teamsData, poolsJson, bracketData]) => {
                setTeams(teamsData);

                // Initialize null scores to 0 for pools
                const initializedPools = {
                    ...poolsJson,
                    matches: poolsJson.matches.map(m => ({
                        ...m,
                        score1: m.score1 ?? 0,
                        score2: m.score2 ?? 0
                    }))
                };
                setPoolsData(initializedPools);

                // Initialize null scores to 0 for bracket
                const initializedBracket = {
                    ...bracketData,
                    quarterFinals: bracketData.quarterFinals.map(m => ({
                        ...m,
                        score1: m.score1 ?? 0,
                        score2: m.score2 ?? 0
                    })),
                    semiFinals: bracketData.semiFinals.map(m => ({
                        ...m,
                        score1: m.score1 ?? 0,
                        score2: m.score2 ?? 0
                    })),
                    thirdPlace: {
                        ...bracketData.thirdPlace,
                        score1: bracketData.thirdPlace.score1 ?? 0,
                        score2: bracketData.thirdPlace.score2 ?? 0
                    },
                    final: {
                        ...bracketData.final,
                        matches: bracketData.final.matches.map(m => ({
                            ...m,
                            score1: m.score1 ?? 0,
                            score2: m.score2 ?? 0
                        }))
                    }
                };
                setBracket(initializedBracket);

                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setLoading(false);
            });
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const getTeamName = (teamId) => {
        if (!teamId) return '???';
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : teamId;
    };

    // Save pools to file
    const savePools = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/save-pools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(poolsData, null, 2)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showMessage('✅ pools.json sauvegardé !');
            } else {
                showMessage('❌ Erreur: ' + (data.error || 'Unknown'), 'error');
            }
        } catch (err) {
            showMessage('❌ Erreur: ' + err.message, 'error');
        }
        setSaving(false);
    };

    // Save bracket to file (with auto-propagation)
    const saveBracket = async () => {
        // Auto-propagate winners to next rounds
        const updatedBracket = propagateWinners(bracket);
        setBracket(updatedBracket);

        setSaving(true);
        try {
            const res = await fetch('/api/save-bracket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBracket, null, 2)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showMessage('✅ bracket.json sauvegardé !');
            } else {
                showMessage('❌ Erreur: ' + (data.error || 'Unknown'), 'error');
            }
        } catch (err) {
            showMessage('❌ Erreur: ' + err.message, 'error');
        }
        setSaving(false);
    };

    // Auto-propagate winners through the bracket
    const propagateWinners = (b) => {
        const newBracket = JSON.parse(JSON.stringify(b));

        // Auto-determine QF winners based on score
        newBracket.quarterFinals.forEach(match => {
            if (match.played && match.score1 !== null && match.score2 !== null) {
                if (match.score1 > match.score2) {
                    match.winner = match.team1;
                } else if (match.score2 > match.score1) {
                    match.winner = match.team2;
                }
            }
        });

        // Propagate QF winners to SF
        const qfWinners = newBracket.quarterFinals.map(m => m.winner);
        const qfLosers = newBracket.quarterFinals.map(m =>
            m.winner === m.team1 ? m.team2 : (m.winner === m.team2 ? m.team1 : null)
        );

        if (qfWinners[0]) newBracket.semiFinals[0].team1 = qfWinners[0];
        if (qfWinners[1]) newBracket.semiFinals[0].team2 = qfWinners[1];
        if (qfWinners[2]) newBracket.semiFinals[1].team1 = qfWinners[2];
        if (qfWinners[3]) newBracket.semiFinals[1].team2 = qfWinners[3];

        // Auto-determine SF winners
        newBracket.semiFinals.forEach(match => {
            if (match.played && match.score1 !== null && match.score2 !== null) {
                if (match.score1 > match.score2) {
                    match.winner = match.team1;
                } else if (match.score2 > match.score1) {
                    match.winner = match.team2;
                }
            }
        });

        // Propagate SF winners to Final, losers to 3rd place
        const sfWinners = newBracket.semiFinals.map(m => m.winner);
        const sfLosers = newBracket.semiFinals.map(m =>
            m.winner === m.team1 ? m.team2 : (m.winner === m.team2 ? m.team1 : null)
        );

        if (sfWinners[0]) newBracket.final.team1 = sfWinners[0];
        if (sfWinners[1]) newBracket.final.team2 = sfWinners[1];
        if (sfLosers[0]) newBracket.thirdPlace.team1 = sfLosers[0];
        if (sfLosers[1]) newBracket.thirdPlace.team2 = sfLosers[1];

        // Auto-determine 3rd place winner
        if (newBracket.thirdPlace.played && newBracket.thirdPlace.score1 !== null && newBracket.thirdPlace.score2 !== null) {
            if (newBracket.thirdPlace.score1 > newBracket.thirdPlace.score2) {
                newBracket.thirdPlace.winner = newBracket.thirdPlace.team1;
            } else if (newBracket.thirdPlace.score2 > newBracket.thirdPlace.score1) {
                newBracket.thirdPlace.winner = newBracket.thirdPlace.team2;
            }
        }

        // Auto-determine final winner based on BO3
        const team1Wins = newBracket.final.matches.filter(m => m.played && m.score1 > m.score2).length;
        const team2Wins = newBracket.final.matches.filter(m => m.played && m.score2 > m.score1).length;
        if (team1Wins >= 2) {
            newBracket.final.winner = newBracket.final.team1;
        } else if (team2Wins >= 2) {
            newBracket.final.winner = newBracket.final.team2;
        }

        return newBracket;
    };

    // Update match in pools
    const updateMatch = (matchId, field, value) => {
        setPoolsData(prev => ({
            ...prev,
            matches: prev.matches.map(m =>
                m.id === matchId ? { ...m, [field]: value } : m
            )
        }));
    };

    // Update bracket match
    const updateBracketMatch = (round, index, field, value) => {
        setBracket(prev => {
            const newBracket = { ...prev };
            if (round === 'quarterFinals') {
                newBracket.quarterFinals = [...prev.quarterFinals];
                newBracket.quarterFinals[index] = { ...prev.quarterFinals[index], [field]: value };
            } else if (round === 'semiFinals') {
                newBracket.semiFinals = [...prev.semiFinals];
                newBracket.semiFinals[index] = { ...prev.semiFinals[index], [field]: value };
            } else if (round === 'thirdPlace') {
                newBracket.thirdPlace = { ...prev.thirdPlace, [field]: value };
            } else if (round === 'final') {
                newBracket.final = { ...prev.final, [field]: value };
            }
            return newBracket;
        });
    };

    // Update final BO3 match
    const updateFinalMatch = (matchIndex, field, value) => {
        setBracket(prev => {
            const newMatches = [...prev.final.matches];
            newMatches[matchIndex] = { ...newMatches[matchIndex], [field]: value };
            return {
                ...prev,
                final: { ...prev.final, matches: newMatches }
            };
        });
    };

    // Calculate seeding from pools
    const calculateSeeding = async () => {
        const poolA = poolsData.pools.find(p => p.id === 'A');
        const poolB = poolsData.pools.find(p => p.id === 'B');

        const getStandings = (pool) => {
            return pool.teams.map(teamId => {
                const teamMatches = poolsData.matches.filter(
                    m => m.pool === pool.id && (m.team1 === teamId || m.team2 === teamId) && m.played
                );
                let points = 0, goalsFor = 0, goalsAgainst = 0;

                teamMatches.forEach(match => {
                    const isTeam1 = match.team1 === teamId;
                    const scored = isTeam1 ? (match.score1 || 0) : (match.score2 || 0);
                    const conceded = isTeam1 ? (match.score2 || 0) : (match.score1 || 0);
                    goalsFor += scored;
                    goalsAgainst += conceded;
                    if (scored > conceded) points += 3;
                    else if (scored === conceded) points += 2;
                    else points += 1;
                });

                return { teamId, points, goalDiff: goalsFor - goalsAgainst, goalsFor };
            }).sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
                return b.goalsFor - a.goalsFor;
            });
        };

        const standingsA = getStandings(poolA);
        const standingsB = getStandings(poolB);

        const newBracket = {
            ...bracket,
            quarterFinals: [
                { ...bracket.quarterFinals[0], team1: standingsA[0]?.teamId, team2: standingsB[3]?.teamId },
                { ...bracket.quarterFinals[1], team1: standingsA[1]?.teamId, team2: standingsB[2]?.teamId },
                { ...bracket.quarterFinals[2], team1: standingsB[0]?.teamId, team2: standingsA[3]?.teamId },
                { ...bracket.quarterFinals[3], team1: standingsB[1]?.teamId, team2: standingsA[2]?.teamId },
            ]
        };

        setBracket(newBracket);

        setSaving(true);
        try {
            const res = await fetch('/api/save-bracket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBracket, null, 2)
            });
            if (res.ok) {
                showMessage('✅ Seeding calculé et sauvegardé !');
            } else {
                showMessage('❌ Erreur de sauvegarde', 'error');
            }
        } catch (err) {
            showMessage('❌ Erreur: ' + err.message, 'error');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement admin...</p>
                </div>
            </div>
        );
    }

    // Score input component (bigger, min 0)
    const ScoreInput = ({ value, onChange }) => (
        <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-bg-secondary border-2 border-border rounded-xl text-text-primary text-center font-bold"
            style={{ width: '70px', padding: '0.75rem', fontSize: '1.5rem' }}
            min="0"
        />
    );

    return (
        <div style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Message toast */}
            {message && (
                <div
                    className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-semibold shadow-lg ${message.type === 'error' ? 'bg-red-900 text-red-300' : 'bg-green-darker text-green-light'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>
                    🔐 Interface Admin
                </h1>
                <p className="text-sm text-text-secondary">
                    Gestion des matchs et du bracket
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['matches', 'bracket', 'seeding'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-semibold transition-all rounded-xl ${activeTab === tab
                            ? 'bg-green-primary text-bg-primary'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                            }`}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                    >
                        {tab === 'matches' ? '📊 Matchs Poules' : tab === 'bracket' ? '🏆 Bracket' : '🎯 Seeding'}
                    </button>
                ))}
            </div>

            {/* MATCHES TAB */}
            {activeTab === 'matches' && (
                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
                        <h2 className="text-2xl font-bold text-text-primary">Matchs de Poules</h2>
                        <div className="flex" style={{ gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    const newId = poolsData.matches.length > 0
                                        ? Math.max(...poolsData.matches.map(m => m.id)) + 1
                                        : 1;
                                    setPoolsData(prev => ({
                                        ...prev,
                                        matches: [...prev.matches, {
                                            id: newId,
                                            pool: 'A',
                                            team1: poolsData.pools[0]?.teams[0] || '',
                                            team2: poolsData.pools[0]?.teams[1] || '',
                                            score1: 0,
                                            score2: 0,
                                            time: '',
                                            played: false
                                        }]
                                    }));
                                }}
                                className="bg-bg-card text-text-primary font-bold rounded-xl transition-all hover:bg-bg-card-hover border border-border"
                                style={{ padding: '1rem 1.5rem', fontSize: '1rem' }}
                            >
                                ➕ Ajouter Match
                            </button>
                            <button
                                onClick={savePools}
                                disabled={saving}
                                className="bg-green-primary text-bg-primary font-bold rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
                                style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                            >
                                {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {poolsData.matches.map(match => (
                            <div
                                key={match.id}
                                className={`bg-bg-card border-2 rounded-2xl ${match.played ? 'border-green-dark' : 'border-border'}`}
                                style={{ padding: '1.5rem' }}
                            >
                                <div className="flex flex-wrap items-center justify-between" style={{ gap: '1rem' }}>
                                    {/* Left: Match info */}
                                    <div className="flex items-center" style={{ gap: '1rem' }}>
                                        <div className="text-center">
                                            <div className="text-xs text-text-muted">#{match.id}</div>
                                        </div>
                                        <select
                                            value={match.pool}
                                            onChange={(e) => updateMatch(match.id, 'pool', e.target.value)}
                                            className="bg-bg-secondary border border-border rounded-lg text-green-light font-bold"
                                            style={{ padding: '0.5rem' }}
                                        >
                                            <option value="A">Poule A</option>
                                            <option value="B">Poule B</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={match.time || ''}
                                            onChange={(e) => updateMatch(match.id, 'time', e.target.value)}
                                            className="bg-bg-secondary border border-border rounded-lg text-text-primary text-center font-semibold"
                                            style={{ width: '70px', padding: '0.5rem' }}
                                            placeholder="12:00"
                                        />
                                    </div>

                                    {/* Center: Teams & Score */}
                                    <div className="flex items-center" style={{ gap: '0.75rem' }}>
                                        <select
                                            value={match.team1}
                                            onChange={(e) => updateMatch(match.id, 'team1', e.target.value)}
                                            className="bg-bg-secondary border border-border rounded-lg text-text-primary font-semibold"
                                            style={{ padding: '0.5rem', maxWidth: '100px' }}
                                        >
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        <ScoreInput
                                            value={match.score1}
                                            onChange={(val) => updateMatch(match.id, 'score1', val)}
                                        />
                                        <span className="text-text-muted text-xl font-bold">-</span>
                                        <ScoreInput
                                            value={match.score2}
                                            onChange={(val) => updateMatch(match.id, 'score2', val)}
                                        />
                                        <select
                                            value={match.team2}
                                            onChange={(e) => updateMatch(match.id, 'team2', e.target.value)}
                                            className="bg-bg-secondary border border-border rounded-lg text-text-primary font-semibold"
                                            style={{ padding: '0.5rem', maxWidth: '100px' }}
                                        >
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Right: Status & Delete */}
                                    <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                        <button
                                            onClick={() => updateMatch(match.id, 'played', !match.played)}
                                            className={`font-bold rounded-xl transition-all ${match.played
                                                ? 'bg-green-primary text-bg-primary'
                                                : 'bg-bg-secondary text-text-muted border-2 border-dashed border-border'
                                                }`}
                                            style={{ padding: '0.75rem 1rem' }}
                                        >
                                            {match.played ? '✅' : '⏳'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Supprimer ce match ?')) {
                                                    setPoolsData(prev => ({
                                                        ...prev,
                                                        matches: prev.matches.filter(m => m.id !== match.id)
                                                    }));
                                                }
                                            }}
                                            className="bg-red-900/50 text-red-400 font-bold rounded-xl transition-all hover:bg-red-900"
                                            style={{ padding: '0.75rem 1rem' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* BRACKET TAB */}
            {activeTab === 'bracket' && bracket && (
                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
                        <h2 className="text-2xl font-bold text-text-primary">Bracket</h2>
                        <button
                            onClick={saveBracket}
                            disabled={saving}
                            className="bg-green-primary text-bg-primary font-bold rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                        >
                            {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder le Bracket'}
                        </button>
                    </div>

                    <p className="text-text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
                        💡 Les gagnants sont déterminés automatiquement par le score. Les matchs suivants sont remplis à la sauvegarde.
                    </p>

                    {/* Quarter Finals */}
                    <h3 className="text-xl font-bold text-text-primary" style={{ marginBottom: '1rem' }}>
                        Quarts de Finale
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                        {bracket.quarterFinals.map((match, idx) => (
                            <div key={idx} className={`bg-bg-card border-2 rounded-2xl ${match.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1.25rem' }}>
                                <div className="flex flex-wrap items-center justify-between" style={{ gap: '1rem' }}>
                                    <span className="text-lg font-bold text-green-light bg-bg-secondary rounded-lg" style={{ padding: '0.5rem 1rem' }}>
                                        QF{idx + 1}
                                    </span>

                                    <div className="flex items-center" style={{ gap: '1rem' }}>
                                        <span className="font-bold text-text-primary text-lg">{getTeamName(match.team1)}</span>
                                        <ScoreInput
                                            value={match.score1}
                                            onChange={(val) => updateBracketMatch('quarterFinals', idx, 'score1', val)}
                                        />
                                        <span className="text-text-muted text-2xl font-bold">-</span>
                                        <ScoreInput
                                            value={match.score2}
                                            onChange={(val) => updateBracketMatch('quarterFinals', idx, 'score2', val)}
                                        />
                                        <span className="font-bold text-text-primary text-lg">{getTeamName(match.team2)}</span>
                                    </div>

                                    <button
                                        onClick={() => updateBracketMatch('quarterFinals', idx, 'played', !match.played)}
                                        className={`font-bold rounded-xl transition-all ${match.played
                                            ? 'bg-green-primary text-bg-primary'
                                            : 'bg-bg-secondary text-text-muted border-2 border-dashed border-border'
                                            }`}
                                        style={{ padding: '0.75rem 1.25rem' }}
                                    >
                                        {match.played ? '✅ Joué' : '⏳'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Semi Finals */}
                    <h3 className="text-xl font-bold text-text-primary" style={{ marginBottom: '1rem' }}>
                        Demi-Finales
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                        {bracket.semiFinals.map((match, idx) => (
                            <div key={idx} className={`bg-bg-card border-2 rounded-2xl ${match.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1.25rem' }}>
                                <div className="flex flex-wrap items-center justify-between" style={{ gap: '1rem' }}>
                                    <span className="text-lg font-bold text-green-light bg-bg-secondary rounded-lg" style={{ padding: '0.5rem 1rem' }}>
                                        SF{idx + 1}
                                    </span>

                                    <div className="flex items-center" style={{ gap: '1rem' }}>
                                        <span className="font-bold text-text-primary text-lg">{getTeamName(match.team1)}</span>
                                        <ScoreInput
                                            value={match.score1}
                                            onChange={(val) => updateBracketMatch('semiFinals', idx, 'score1', val)}
                                        />
                                        <span className="text-text-muted text-2xl font-bold">-</span>
                                        <ScoreInput
                                            value={match.score2}
                                            onChange={(val) => updateBracketMatch('semiFinals', idx, 'score2', val)}
                                        />
                                        <span className="font-bold text-text-primary text-lg">{getTeamName(match.team2)}</span>
                                    </div>

                                    <button
                                        onClick={() => updateBracketMatch('semiFinals', idx, 'played', !match.played)}
                                        className={`font-bold rounded-xl transition-all ${match.played
                                            ? 'bg-green-primary text-bg-primary'
                                            : 'bg-bg-secondary text-text-muted border-2 border-dashed border-border'
                                            }`}
                                        style={{ padding: '0.75rem 1.25rem' }}
                                    >
                                        {match.played ? '✅ Joué' : '⏳'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Third Place */}
                    <h3 className="text-xl font-bold text-text-primary" style={{ marginBottom: '1rem' }}>
                        🥉 Petite Finale
                    </h3>
                    <div className={`bg-bg-card border-2 rounded-2xl ${bracket.thirdPlace.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
                        <div className="flex flex-wrap items-center justify-between" style={{ gap: '1rem' }}>
                            <div className="flex items-center" style={{ gap: '1rem' }}>
                                <span className="font-bold text-text-primary text-lg">{getTeamName(bracket.thirdPlace.team1)}</span>
                                <ScoreInput
                                    value={bracket.thirdPlace.score1}
                                    onChange={(val) => updateBracketMatch('thirdPlace', 0, 'score1', val)}
                                />
                                <span className="text-text-muted text-2xl font-bold">-</span>
                                <ScoreInput
                                    value={bracket.thirdPlace.score2}
                                    onChange={(val) => updateBracketMatch('thirdPlace', 0, 'score2', val)}
                                />
                                <span className="font-bold text-text-primary text-lg">{getTeamName(bracket.thirdPlace.team2)}</span>
                            </div>

                            <button
                                onClick={() => updateBracketMatch('thirdPlace', 0, 'played', !bracket.thirdPlace.played)}
                                className={`font-bold rounded-xl transition-all ${bracket.thirdPlace.played
                                    ? 'bg-green-primary text-bg-primary'
                                    : 'bg-bg-secondary text-text-muted border-2 border-dashed border-border'
                                    }`}
                                style={{ padding: '0.75rem 1.25rem' }}
                            >
                                {bracket.thirdPlace.played ? '✅ Joué' : '⏳'}
                            </button>
                        </div>
                    </div>

                    {/* Grande Finale BO3 */}
                    <h3 className="text-xl font-bold text-green-light" style={{ marginBottom: '1rem' }}>
                        🏆 Grande Finale (BO3)
                    </h3>
                    <div className="bg-gradient-to-br from-green-darker to-bg-card border-2 border-green-primary rounded-2xl" style={{ padding: '1.5rem' }}>
                        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
                            <span className="text-2xl font-bold text-text-primary">{getTeamName(bracket.final.team1)}</span>
                            <span className="text-text-muted mx-4 text-xl">vs</span>
                            <span className="text-2xl font-bold text-text-primary">{getTeamName(bracket.final.team2)}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bracket.final.matches.map((match, idx) => (
                                <div key={idx} className="bg-bg-card rounded-xl flex flex-wrap items-center justify-between" style={{ padding: '1rem', gap: '1rem' }}>
                                    <span className="text-lg font-bold text-text-muted">Match {idx + 1}</span>
                                    <div className="flex items-center" style={{ gap: '1rem' }}>
                                        <ScoreInput
                                            value={match.score1}
                                            onChange={(val) => updateFinalMatch(idx, 'score1', val)}
                                        />
                                        <span className="text-text-muted text-xl">-</span>
                                        <ScoreInput
                                            value={match.score2}
                                            onChange={(val) => updateFinalMatch(idx, 'score2', val)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => updateFinalMatch(idx, 'played', !match.played)}
                                        className={`font-bold rounded-xl transition-all ${match.played
                                            ? 'bg-green-primary text-bg-primary'
                                            : 'bg-bg-secondary text-text-muted border-2 border-dashed border-border'
                                            }`}
                                        style={{ padding: '0.75rem 1.25rem' }}
                                    >
                                        {match.played ? '✅ Joué' : '⏳'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {bracket.final.winner && (
                            <div className="text-center" style={{ marginTop: '1.5rem' }}>
                                <span className="text-2xl font-bold text-green-light">
                                    🏆 Champion : {getTeamName(bracket.final.winner)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SEEDING TAB */}
            {activeTab === 'seeding' && (
                <div>
                    <h2 className="text-2xl font-bold text-text-primary" style={{ marginBottom: '1.5rem' }}>
                        🎯 Seeding Automatique
                    </h2>

                    <div className="bg-bg-card border border-border rounded-2xl" style={{ padding: '2rem' }}>
                        <p className="text-text-secondary text-lg" style={{ marginBottom: '1.5rem' }}>
                            Calcule automatiquement les places en fonction des résultats des poules et remplit les quarts de finale.
                        </p>

                        <div className="bg-bg-secondary rounded-xl" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <p className="text-text-primary font-semibold text-lg" style={{ marginBottom: '0.75rem' }}>Système de croisement :</p>
                            <ul className="text-text-secondary" style={{ fontSize: '1rem', lineHeight: '1.75' }}>
                                <li>• QF1 : 1er Poule A vs 4ème Poule B</li>
                                <li>• QF2 : 2ème Poule A vs 3ème Poule B</li>
                                <li>• QF3 : 1er Poule B vs 4ème Poule A</li>
                                <li>• QF4 : 2ème Poule B vs 3ème Poule A</li>
                            </ul>
                        </div>

                        <button
                            onClick={calculateSeeding}
                            disabled={saving}
                            className="w-full bg-green-primary text-bg-primary font-bold rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ padding: '1.25rem', fontSize: '1.25rem' }}
                        >
                            {saving ? '⏳ Calcul en cours...' : '🎯 Calculer et Sauvegarder le Seeding'}
                        </button>
                    </div>

                    <p className="text-text-muted" style={{ marginTop: '1rem' }}>
                        ⚠️ Assurez-vous que tous les matchs de poules sont marqués comme "Joué" avant de calculer le seeding.
                    </p>
                </div>
            )}
        </div>
    );
}
