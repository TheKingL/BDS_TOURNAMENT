import { useState, useEffect } from 'react';

export default function AdminPage() {
    // Tournament selection
    const [activeTournament, setActiveTournament] = useState('babyfoot');
    const [activeTab, setActiveTab] = useState('matches');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Babyfoot data
    const [babyfootTeams, setBabyfootTeams] = useState([]);
    const [babyfootPools, setBabyfootPools] = useState({ pools: [], matches: [] });
    const [babyfootBracket, setBabyfootBracket] = useState(null);

    // Ping-Pong Solo data
    const [soloPlayers, setSoloPlayers] = useState([]);
    const [soloLeague, setSoloLeague] = useState({ players: [], matches: [] });
    const [soloBracket, setSoloBracket] = useState(null);

    // Ping-Pong Duo data
    const [duoTeams, setDuoTeams] = useState([]);
    const [duoLeague, setDuoLeague] = useState({ teams: [], matches: [] });
    const [duoBracket, setDuoBracket] = useState(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [
                babyfootTeamsData, babyfootPoolsData, babyfootBracketData,
                soloPlayersData, soloLeagueData, soloBracketData,
                duoTeamsData, duoLeagueData, duoBracketData
            ] = await Promise.all([
                fetch(`${import.meta.env.BASE_URL}data/babyfoot/teams.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/babyfoot/pools.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/babyfoot/bracket.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/players.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/league.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-solo/bracket.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/teams.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/league.json`).then(r => r.json()),
                fetch(`${import.meta.env.BASE_URL}data/pingpong-duo/bracket.json`).then(r => r.json()),
            ]);

            setBabyfootTeams(babyfootTeamsData);
            setBabyfootPools(initScores(babyfootPoolsData));
            setBabyfootBracket(initBracketScores(babyfootBracketData));
            setSoloPlayers(soloPlayersData);
            setSoloLeague(initLeagueScores(soloLeagueData));
            setSoloBracket(initSoloBracketScores(soloBracketData));
            setDuoTeams(duoTeamsData);
            setDuoLeague(initLeagueScores(duoLeagueData, 'team'));
            setDuoBracket(initDuoBracketScores(duoBracketData));
        } catch (err) {
            console.error('Error loading data:', err);
        }
        setLoading(false);
    };

    // Initialize scores to 0
    const initScores = (data) => ({
        ...data,
        matches: data.matches.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 }))
    });

    const initLeagueScores = (data, type = 'player') => ({
        ...data,
        matches: data.matches.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 }))
    });

    const initBracketScores = (b) => ({
        ...b,
        quarterFinals: b.quarterFinals.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })),
        semiFinals: b.semiFinals.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })),
        thirdPlace: { ...b.thirdPlace, score1: b.thirdPlace.score1 ?? 0, score2: b.thirdPlace.score2 ?? 0 },
        final: { ...b.final, matches: b.final.matches.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })) }
    });

    const initSoloBracketScores = (b) => ({
        ...b,
        quarterFinals: b.quarterFinals.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })),
        semiFinals: b.semiFinals.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })),
        thirdPlace: { ...b.thirdPlace, score1: b.thirdPlace.score1 ?? 0, score2: b.thirdPlace.score2 ?? 0 },
        final: { ...b.final, matches: b.final.matches.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })) }
    });

    const initDuoBracketScores = (b) => ({
        ...b,
        semiFinals: b.semiFinals.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })),
        thirdPlace: { ...b.thirdPlace, score1: b.thirdPlace.score1 ?? 0, score2: b.thirdPlace.score2 ?? 0 },
        final: { ...b.final, matches: b.final.matches.map(m => ({ ...m, score1: m.score1 ?? 0, score2: m.score2 ?? 0 })) }
    });

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // Save functions
    const saveData = async (endpoint, data, name) => {
        setSaving(true);
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data, null, 2)
            });
            const result = await res.json();
            if (res.ok && result.success) {
                showMessage(`✅ ${name} sauvegardé !`);
            } else {
                showMessage(`❌ Erreur: ${result.error}`, 'error');
            }
        } catch (err) {
            showMessage(`❌ Erreur: ${err.message}`, 'error');
        }
        setSaving(false);
    };

    // Score input component
    const ScoreInput = ({ value, onChange }) => (
        <input
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-bg-secondary border-2 border-border rounded-lg text-text-primary text-center font-bold"
            style={{ width: '60px', padding: '0.5rem', fontSize: '1.25rem' }}
            min="0"
        />
    );

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

    // ========== BABYFOOT ==========
    const renderBabyfoot = () => {
        const getTeamName = (id) => babyfootTeams.find(t => t.id === id)?.name || id || '???';

        const updateMatch = (matchId, field, value) => {
            setBabyfootPools(prev => ({
                ...prev,
                matches: prev.matches.map(m => m.id === matchId ? { ...m, [field]: value } : m)
            }));
        };

        const updateBracketMatch = (round, index, field, value) => {
            setBabyfootBracket(prev => {
                const newBracket = { ...prev };
                if (round === 'quarterFinals') {
                    newBracket.quarterFinals = [...prev.quarterFinals];
                    newBracket.quarterFinals[index] = { ...prev.quarterFinals[index], [field]: value };
                } else if (round === 'semiFinals') {
                    newBracket.semiFinals = [...prev.semiFinals];
                    newBracket.semiFinals[index] = { ...prev.semiFinals[index], [field]: value };
                } else if (round === 'thirdPlace') {
                    newBracket.thirdPlace = { ...prev.thirdPlace, [field]: value };
                }
                return newBracket;
            });
        };

        const updateFinalMatch = (idx, field, value) => {
            setBabyfootBracket(prev => ({
                ...prev,
                final: { ...prev.final, matches: prev.final.matches.map((m, i) => i === idx ? { ...m, [field]: value } : m) }
            }));
        };

        return (
            <div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['matches', 'bracket', 'seeding'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`font-semibold rounded-lg ${activeTab === tab ? 'bg-green-primary text-bg-primary' : 'bg-bg-card text-text-secondary'}`}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            {tab === 'matches' ? '📊 Poules' : tab === 'bracket' ? '🏆 Bracket' : '🎯 Seeding'}
                        </button>
                    ))}
                </div>

                {/* Matches Tab */}
                {activeTab === 'matches' && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Matchs de Poules</h3>
                            <button onClick={() => saveData('/api/save-babyfoot-pools', babyfootPools, 'Poules')} disabled={saving} className="bg-green-primary text-bg-primary font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {babyfootPools.matches.map(match => (
                                <div key={match.id} className={`bg-bg-card border-2 rounded-xl ${match.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1rem' }}>
                                    <div className="flex flex-wrap items-center justify-between" style={{ gap: '1rem' }}>
                                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                            <span className="text-xs text-text-muted">#{match.id}</span>
                                            <select value={match.pool} onChange={(e) => updateMatch(match.id, 'pool', e.target.value)} className="bg-bg-secondary border border-border rounded text-green-light font-bold" style={{ padding: '0.25rem' }}>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                            </select>
                                            <input type="text" value={match.time || ''} onChange={(e) => updateMatch(match.id, 'time', e.target.value)} className="bg-bg-secondary border border-border rounded text-text-primary text-center" style={{ width: '60px', padding: '0.25rem' }} placeholder="12:00" />
                                        </div>
                                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                            <select value={match.team1} onChange={(e) => updateMatch(match.id, 'team1', e.target.value)} className="bg-bg-secondary border border-border rounded text-text-primary" style={{ padding: '0.25rem' }}>
                                                {babyfootTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                            <ScoreInput value={match.score1} onChange={(v) => updateMatch(match.id, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={match.score2} onChange={(v) => updateMatch(match.id, 'score2', v)} />
                                            <select value={match.team2} onChange={(e) => updateMatch(match.id, 'team2', e.target.value)} className="bg-bg-secondary border border-border rounded text-text-primary" style={{ padding: '0.25rem' }}>
                                                {babyfootTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                            <button onClick={() => updateMatch(match.id, 'played', !match.played)} className={`font-bold rounded-lg ${match.played ? 'bg-green-primary text-bg-primary' : 'bg-bg-secondary text-text-muted border border-dashed border-border'}`} style={{ padding: '0.5rem 0.75rem' }}>
                                                {match.played ? '✅' : '⏳'}
                                            </button>
                                            <button onClick={() => setBabyfootPools(prev => ({ ...prev, matches: prev.matches.filter(m => m.id !== match.id) }))} className="bg-red-900/50 text-red-400 rounded-lg" style={{ padding: '0.5rem' }}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => {
                            const newId = babyfootPools.matches.length > 0 ? Math.max(...babyfootPools.matches.map(m => m.id)) + 1 : 1;
                            setBabyfootPools(prev => ({ ...prev, matches: [...prev.matches, { id: newId, pool: 'A', team1: babyfootTeams[0]?.id, team2: babyfootTeams[1]?.id, score1: 0, score2: 0, time: '', played: false }] }));
                        }} className="bg-bg-card text-text-primary font-bold rounded-lg border border-border" style={{ padding: '0.75rem 1.25rem', marginTop: '1rem' }}>
                            ➕ Ajouter Match
                        </button>
                    </div>
                )}

                {/* Bracket Tab */}
                {activeTab === 'bracket' && babyfootBracket && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Bracket</h3>
                            <button onClick={() => saveData('/api/save-babyfoot-bracket', babyfootBracket, 'Bracket')} disabled={saving} className="bg-green-primary text-bg-primary font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>

                        {/* QF */}
                        <h4 className="font-bold text-text-primary" style={{ marginBottom: '0.5rem' }}>Quarts de Finale</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {babyfootBracket.quarterFinals.map((m, idx) => (
                                <div key={idx} className={`bg-bg-card border-2 rounded-xl ${m.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1rem' }}>
                                    <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                        <span className="text-xs text-green-light font-bold">QF{idx + 1}</span>
                                        <span className="text-text-primary font-semibold">{getTeamName(m.team1)}</span>
                                        <ScoreInput value={m.score1} onChange={(v) => updateBracketMatch('quarterFinals', idx, 'score1', v)} />
                                        <span className="text-text-muted">-</span>
                                        <ScoreInput value={m.score2} onChange={(v) => updateBracketMatch('quarterFinals', idx, 'score2', v)} />
                                        <span className="text-text-primary font-semibold">{getTeamName(m.team2)}</span>
                                        <button onClick={() => updateBracketMatch('quarterFinals', idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-green-primary text-bg-primary' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                            {m.played ? '✅' : '⏳'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SF */}
                        <h4 className="font-bold text-text-primary" style={{ marginBottom: '0.5rem' }}>Demi-Finales</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {babyfootBracket.semiFinals.map((m, idx) => (
                                <div key={idx} className={`bg-bg-card border-2 rounded-xl ${m.played ? 'border-green-dark' : 'border-border'}`} style={{ padding: '1rem' }}>
                                    <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                        <span className="text-xs text-green-light font-bold">SF{idx + 1}</span>
                                        <span className="text-text-primary font-semibold">{getTeamName(m.team1)}</span>
                                        <ScoreInput value={m.score1} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score1', v)} />
                                        <span className="text-text-muted">-</span>
                                        <ScoreInput value={m.score2} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score2', v)} />
                                        <span className="text-text-primary font-semibold">{getTeamName(m.team2)}</span>
                                        <button onClick={() => updateBracketMatch('semiFinals', idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-green-primary text-bg-primary' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                            {m.played ? '✅' : '⏳'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3rd Place */}
                        <h4 className="font-bold text-amber-400" style={{ marginBottom: '0.5rem' }}>🥉 Petite Finale</h4>
                        <div className={`bg-bg-card border-2 rounded-xl ${babyfootBracket.thirdPlace.played ? 'border-amber-600' : 'border-border'}`} style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                            <div className="flex items-center justify-center" style={{ gap: '0.5rem' }}>
                                <span className="text-text-primary font-semibold">{getTeamName(babyfootBracket.thirdPlace.team1)}</span>
                                <ScoreInput value={babyfootBracket.thirdPlace.score1} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score1', v)} />
                                <span className="text-text-muted">-</span>
                                <ScoreInput value={babyfootBracket.thirdPlace.score2} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score2', v)} />
                                <span className="text-text-primary font-semibold">{getTeamName(babyfootBracket.thirdPlace.team2)}</span>
                                <button onClick={() => updateBracketMatch('thirdPlace', 0, 'played', !babyfootBracket.thirdPlace.played)} className={`rounded-lg ${babyfootBracket.thirdPlace.played ? 'bg-green-primary text-bg-primary' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                    {babyfootBracket.thirdPlace.played ? '✅' : '⏳'}
                                </button>
                            </div>
                        </div>

                        {/* Final BO3 */}
                        <h4 className="font-bold text-green-light" style={{ marginBottom: '0.5rem' }}>🏆 Finale (BO3)</h4>
                        <div className="bg-gradient-to-br from-green-darker to-bg-card border-2 border-green-primary rounded-xl" style={{ padding: '1rem' }}>
                            <div className="text-center" style={{ marginBottom: '1rem' }}>
                                <span className="font-bold text-text-primary text-lg">{getTeamName(babyfootBracket.final.team1)}</span>
                                <span className="text-text-muted mx-2">vs</span>
                                <span className="font-bold text-text-primary text-lg">{getTeamName(babyfootBracket.final.team2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                {babyfootBracket.final.matches.map((m, idx) => (
                                    <div key={idx} className="bg-bg-card rounded-lg" style={{ padding: '0.75rem' }}>
                                        <div className="text-xs text-text-muted text-center" style={{ marginBottom: '0.5rem' }}>Match {idx + 1}</div>
                                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                            <ScoreInput value={m.score1} onChange={(v) => updateFinalMatch(idx, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateFinalMatch(idx, 'score2', v)} />
                                            <button onClick={() => updateFinalMatch(idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-green-primary text-bg-primary' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                                {m.played ? '✅' : '⏳'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Seeding Tab */}
                {activeTab === 'seeding' && (
                    <div className="bg-bg-card border border-border rounded-xl" style={{ padding: '1.5rem' }}>
                        <h3 className="text-xl font-bold text-text-primary" style={{ marginBottom: '1rem' }}>🎯 Calcul du Seeding</h3>
                        <p className="text-text-secondary" style={{ marginBottom: '1rem' }}>
                            Calcule automatiquement le classement des poules et remplit les quarts de finale.
                        </p>
                        <button onClick={async () => {
                            const poolA = babyfootPools.pools.find(p => p.id === 'A');
                            const poolB = babyfootPools.pools.find(p => p.id === 'B');
                            const getStandings = (pool) => {
                                return pool.teams.map(teamId => {
                                    const teamMatches = babyfootPools.matches.filter(m => m.pool === pool.id && (m.team1 === teamId || m.team2 === teamId) && m.played);
                                    let points = 0, gf = 0, ga = 0;
                                    teamMatches.forEach(m => {
                                        const isT1 = m.team1 === teamId;
                                        const s = isT1 ? m.score1 : m.score2, c = isT1 ? m.score2 : m.score1;
                                        gf += s; ga += c;
                                        if (s > c) points += 3; else if (s === c) points += 2; else points += 1;
                                    });
                                    return { teamId, points, diff: gf - ga, gf };
                                }).sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf);
                            };
                            const sA = getStandings(poolA), sB = getStandings(poolB);
                            const newBracket = {
                                ...babyfootBracket,
                                quarterFinals: [
                                    { ...babyfootBracket.quarterFinals[0], team1: sA[0]?.teamId, team2: sB[3]?.teamId },
                                    { ...babyfootBracket.quarterFinals[1], team1: sA[1]?.teamId, team2: sB[2]?.teamId },
                                    { ...babyfootBracket.quarterFinals[2], team1: sB[0]?.teamId, team2: sA[3]?.teamId },
                                    { ...babyfootBracket.quarterFinals[3], team1: sB[1]?.teamId, team2: sA[2]?.teamId },
                                ]
                            };
                            setBabyfootBracket(newBracket);
                            await saveData('/api/save-babyfoot-bracket', newBracket, 'Seeding');
                        }} className="bg-green-primary text-bg-primary font-bold rounded-lg" style={{ padding: '1rem 2rem' }}>
                            🎯 Calculer et Sauvegarder
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // ========== PING-PONG SOLO ==========
    const renderSolo = () => {
        const getPlayerName = (id) => soloPlayers.find(p => p.id === id)?.name || id || '???';

        const updateLeagueMatch = (matchId, field, value) => {
            setSoloLeague(prev => ({
                ...prev,
                matches: prev.matches.map(m => m.id === matchId ? { ...m, [field]: value } : m)
            }));
        };

        // Sort matches by date then time
        const sortedMatches = [...soloLeague.matches].sort((a, b) => {
            if (a.date && b.date) {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                if (a.time && b.time) return a.time.localeCompare(b.time);
                return 0;
            }
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            return a.id - b.id;
        });

        return (
            <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['players', 'league', 'bracket'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`font-semibold rounded-lg ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-bg-card text-text-secondary'}`} style={{ padding: '0.5rem 1rem' }}>
                            {tab === 'players' ? '👤 Joueurs' : tab === 'league' ? '📊 Ligue' : '🏆 Bracket'}
                        </button>
                    ))}
                </div>

                {/* Players Tab */}
                {activeTab === 'players' && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Joueurs ({soloPlayers.length})</h3>
                            <button onClick={() => saveData('/api/save-pingpong-solo-players', soloPlayers, 'Joueurs')} disabled={saving} className="bg-blue-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {soloPlayers.map((p, idx) => (
                                <div key={p.id} className="bg-bg-card border border-border rounded-lg flex items-center" style={{ padding: '0.75rem', gap: '0.5rem' }}>
                                    <span className="text-text-muted text-sm" style={{ width: '30px' }}>#{idx + 1}</span>
                                    <input type="text" value={p.name} onChange={(e) => setSoloPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, name: e.target.value } : pl))} className="flex-1 bg-bg-secondary border border-border rounded text-text-primary" style={{ padding: '0.5rem' }} />
                                    <button onClick={() => setSoloPlayers(prev => prev.filter(pl => pl.id !== p.id))} className="text-red-400">🗑️</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSoloPlayers(prev => [...prev, { id: `player${Date.now()}`, name: 'Nouveau Joueur' }])} className="bg-bg-card text-text-primary font-bold rounded-lg border border-border" style={{ padding: '0.75rem 1.25rem', marginTop: '1rem' }}>
                            ➕ Ajouter Joueur
                        </button>
                    </div>
                )}

                {/* League Tab */}
                {activeTab === 'league' && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Matchs de Ligue</h3>
                            <button onClick={() => saveData('/api/save-pingpong-solo-league', soloLeague, 'Ligue')} disabled={saving} className="bg-blue-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>
                        {soloLeague.matches.length === 0 ? (
                            <p className="text-text-muted text-center" style={{ padding: '2rem' }}>Aucun match. Ajoutez des joueurs d'abord.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {sortedMatches.map(m => (
                                    <div key={m.id} className={`bg-bg-card border-2 rounded-xl ${m.forfait ? 'border-red-500' : m.played ? 'border-blue-500' : 'border-border'}`} style={{ padding: '0.75rem' }}>
                                        <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                            <div style={{ minWidth: '60px' }}>
                                                <div className="text-xs text-text-muted">#{m.id}</div>
                                                <div className="text-blue-400 font-semibold text-xs">{m.time || '-:-'}</div>
                                                <div className="text-xs text-text-muted">{m.date || '-/-'}</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                <span className={`font-semibold ${m.forfait === m.player1 ? 'text-red-400' : 'text-text-primary'}`}>
                                                    {getPlayerName(m.player1)}
                                                    {m.forfait === m.player1 && <span className="text-xs text-red-500 ml-1">(F)</span>}
                                                </span>
                                            </div>
                                            <button onClick={() => updateLeagueMatch(m.id, 'forfait', m.forfait === m.player1 ? null : m.player1)} className={`rounded text-xs ${m.forfait === m.player1 ? 'bg-red-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.15rem 0.3rem' }}>F1</button>
                                            <ScoreInput value={m.score1} onChange={(v) => updateLeagueMatch(m.id, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateLeagueMatch(m.id, 'score2', v)} />
                                            <button onClick={() => updateLeagueMatch(m.id, 'forfait', m.forfait === m.player2 ? null : m.player2)} className={`rounded text-xs ${m.forfait === m.player2 ? 'bg-red-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.15rem 0.3rem' }}>F2</button>
                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                <span className={`font-semibold ${m.forfait === m.player2 ? 'text-red-400' : 'text-text-primary'}`}>
                                                    {getPlayerName(m.player2)}
                                                    {m.forfait === m.player2 && <span className="text-xs text-red-500 ml-1">(F)</span>}
                                                </span>
                                            </div>
                                            <button onClick={() => updateLeagueMatch(m.id, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-blue-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                                {m.played ? '✅' : '⏳'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Bracket Tab */}
                {activeTab === 'bracket' && soloBracket && (() => {
                    const updateBracketMatch = (round, index, field, value) => {
                        setSoloBracket(prev => {
                            const newBracket = { ...prev };
                            if (round === 'quarterFinals') {
                                newBracket.quarterFinals = [...prev.quarterFinals];
                                newBracket.quarterFinals[index] = { ...prev.quarterFinals[index], [field]: value };
                            } else if (round === 'semiFinals') {
                                newBracket.semiFinals = [...prev.semiFinals];
                                newBracket.semiFinals[index] = { ...prev.semiFinals[index], [field]: value };
                            } else if (round === 'thirdPlace') {
                                newBracket.thirdPlace = { ...prev.thirdPlace, [field]: value };
                            }
                            return newBracket;
                        });
                    };
                    const updateFinalMatch = (idx, field, value) => {
                        setSoloBracket(prev => ({
                            ...prev,
                            final: { ...prev.final, matches: prev.final.matches.map((m, i) => i === idx ? { ...m, [field]: value } : m) }
                        }));
                    };
                    return (
                        <div>
                            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                <h3 className="text-xl font-bold text-text-primary">Bracket Solo</h3>
                                <button onClick={() => saveData('/api/save-pingpong-solo-bracket', soloBracket, 'Bracket')} disabled={saving} className="bg-blue-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                    {saving ? '⏳' : '💾 Sauvegarder'}
                                </button>
                            </div>

                            {/* QF */}
                            <h4 className="font-bold text-blue-400" style={{ marginBottom: '0.5rem' }}>Quarts de Finale</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {soloBracket.quarterFinals.map((m, idx) => (
                                    <div key={idx} className={`bg-bg-secondary border-2 rounded-xl ${m.played ? 'border-blue-500' : 'border-border'}`} style={{ padding: '0.75rem' }}>
                                        <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                            <span className="text-xs text-blue-400 font-bold">QF{idx + 1}</span>
                                            <span className="text-text-primary font-semibold text-sm">{getPlayerName(m.player1)}</span>
                                            <ScoreInput value={m.score1} onChange={(v) => updateBracketMatch('quarterFinals', idx, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateBracketMatch('quarterFinals', idx, 'score2', v)} />
                                            <span className="text-text-primary font-semibold text-sm">{getPlayerName(m.player2)}</span>
                                            <button onClick={() => updateBracketMatch('quarterFinals', idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-blue-500 text-white' : 'bg-bg-card text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{m.played ? '✅' : '⏳'}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SF */}
                            <h4 className="font-bold text-blue-400" style={{ marginBottom: '0.5rem' }}>Demi-Finales</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {soloBracket.semiFinals.map((m, idx) => (
                                    <div key={idx} className={`bg-bg-secondary border-2 rounded-xl ${m.played ? 'border-blue-500' : 'border-border'}`} style={{ padding: '0.75rem' }}>
                                        <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                            <span className="text-xs text-blue-400 font-bold">SF{idx + 1}</span>
                                            <span className="text-text-primary font-semibold text-sm">{getPlayerName(m.player1)}</span>
                                            <ScoreInput value={m.score1} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score2', v)} />
                                            <span className="text-text-primary font-semibold text-sm">{getPlayerName(m.player2)}</span>
                                            <button onClick={() => updateBracketMatch('semiFinals', idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-blue-500 text-white' : 'bg-bg-card text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{m.played ? '✅' : '⏳'}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 3rd Place */}
                            <h4 className="font-bold text-amber-400" style={{ marginBottom: '0.5rem' }}>🥉 Petite Finale</h4>
                            <div className={`bg-bg-secondary border-2 rounded-xl ${soloBracket.thirdPlace.played ? 'border-amber-500' : 'border-border'}`} style={{ padding: '0.75rem', marginBottom: '1.5rem' }}>
                                <div className="flex items-center justify-center" style={{ gap: '0.5rem' }}>
                                    <span className="text-text-primary font-semibold">{getPlayerName(soloBracket.thirdPlace.player1)}</span>
                                    <ScoreInput value={soloBracket.thirdPlace.score1} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score1', v)} />
                                    <span className="text-text-muted">-</span>
                                    <ScoreInput value={soloBracket.thirdPlace.score2} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score2', v)} />
                                    <span className="text-text-primary font-semibold">{getPlayerName(soloBracket.thirdPlace.player2)}</span>
                                    <button onClick={() => updateBracketMatch('thirdPlace', 0, 'played', !soloBracket.thirdPlace.played)} className={`rounded-lg ${soloBracket.thirdPlace.played ? 'bg-amber-500 text-bg-primary' : 'bg-bg-card text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{soloBracket.thirdPlace.played ? '✅' : '⏳'}</button>
                                </div>
                            </div>

                            {/* Final BO3 */}
                            <h4 className="font-bold text-green-400" style={{ marginBottom: '0.5rem' }}>🏆 Finale (BO5)</h4>
                            <div className="bg-gradient-to-br from-blue-900/50 to-bg-secondary border-2 border-blue-500 rounded-xl" style={{ padding: '1rem' }}>
                                <div className="text-center" style={{ marginBottom: '1rem' }}>
                                    <span className="font-bold text-text-primary">{getPlayerName(soloBracket.final.player1)}</span>
                                    <span className="text-text-muted mx-2">vs</span>
                                    <span className="font-bold text-text-primary">{getPlayerName(soloBracket.final.player2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    {soloBracket.final.matches.map((m, idx) => (
                                        <div key={idx} className="bg-bg-card rounded-lg" style={{ padding: '0.75rem' }}>
                                            <div className="text-xs text-text-muted text-center" style={{ marginBottom: '0.5rem' }}>Set {idx + 1}</div>
                                            <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                                <ScoreInput value={m.score1} onChange={(v) => updateFinalMatch(idx, 'score1', v)} />
                                                <span className="text-text-muted">-</span>
                                                <ScoreInput value={m.score2} onChange={(v) => updateFinalMatch(idx, 'score2', v)} />
                                                <button onClick={() => updateFinalMatch(idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-blue-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{m.played ? '✅' : '⏳'}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    // ========== PING-PONG DUO ==========
    const renderDuo = () => {
        const getTeamName = (id) => duoTeams.find(t => t.id === id)?.name || id || '???';
        const getTeamPlayers = (id) => {
            const team = duoTeams.find(t => t.id === id);
            if (!team) return '';
            return team.players.map(p => {
                const name = p.charAt(0).toUpperCase() + p.slice(1);
                return name.split(' ')[0];
            }).join(' & ');
        };

        const updateLeagueMatch = (matchId, field, value) => {
            setDuoLeague(prev => ({
                ...prev,
                matches: prev.matches.map(m => m.id === matchId ? { ...m, [field]: value } : m)
            }));
        };

        // Sort matches by date then time
        const sortedMatches = [...duoLeague.matches].sort((a, b) => {
            if (a.date && b.date) {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                if (a.time && b.time) return a.time.localeCompare(b.time);
                return 0;
            }
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            return a.id - b.id;
        });

        return (
            <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['teams', 'league', 'bracket'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`font-semibold rounded-lg ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-bg-card text-text-secondary'}`} style={{ padding: '0.5rem 1rem' }}>
                            {tab === 'teams' ? '👥 Équipes' : tab === 'league' ? '📊 Ligue' : '🏆 Bracket'}
                        </button>
                    ))}
                </div>

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Équipes ({duoTeams.length})</h3>
                            <button onClick={() => saveData('/api/save-pingpong-duo-teams', duoTeams, 'Équipes')} disabled={saving} className="bg-purple-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {duoTeams.map((t, idx) => (
                                <div key={t.id} className="bg-bg-card border border-border rounded-xl" style={{ padding: '1rem' }}>
                                    <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span className="text-purple-400 font-bold">#{idx + 1}</span>
                                        <input type="text" value={t.name} onChange={(e) => setDuoTeams(prev => prev.map(team => team.id === t.id ? { ...team, name: e.target.value } : team))} className="flex-1 bg-bg-secondary border border-border rounded text-text-primary font-semibold" style={{ padding: '0.5rem' }} />
                                        <button onClick={() => setDuoTeams(prev => prev.filter(team => team.id !== t.id))} className="text-red-400">🗑️</button>
                                    </div>
                                    <div className="flex items-center" style={{ gap: '0.5rem', marginLeft: '2rem' }}>
                                        <span className="text-text-muted text-sm">Joueurs:</span>
                                        <input type="text" value={t.players?.[0] || ''} onChange={(e) => setDuoTeams(prev => prev.map(team => team.id === t.id ? { ...team, players: [e.target.value, team.players?.[1] || ''] } : team))} className="bg-bg-secondary border border-border rounded text-text-primary text-sm" style={{ padding: '0.25rem 0.5rem', flex: 1 }} placeholder="Joueur 1" />
                                        <span className="text-text-muted">&</span>
                                        <input type="text" value={t.players?.[1] || ''} onChange={(e) => setDuoTeams(prev => prev.map(team => team.id === t.id ? { ...team, players: [team.players?.[0] || '', e.target.value] } : team))} className="bg-bg-secondary border border-border rounded text-text-primary text-sm" style={{ padding: '0.25rem 0.5rem', flex: 1 }} placeholder="Joueur 2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setDuoTeams(prev => [...prev, { id: `team${Date.now()}`, name: `Équipe ${prev.length + 1}`, players: ['', ''] }])} className="bg-bg-card text-text-primary font-bold rounded-lg border border-border" style={{ padding: '0.75rem 1.25rem', marginTop: '1rem' }}>
                            ➕ Ajouter Équipe
                        </button>
                    </div>
                )}

                {/* League Tab */}
                {activeTab === 'league' && (
                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <h3 className="text-xl font-bold text-text-primary">Matchs de Ligue</h3>
                            <button onClick={() => saveData('/api/save-pingpong-duo-league', duoLeague, 'Ligue')} disabled={saving} className="bg-purple-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                {saving ? '⏳' : '💾 Sauvegarder'}
                            </button>
                        </div>
                        {duoLeague.matches.length === 0 ? (
                            <p className="text-text-muted text-center" style={{ padding: '2rem' }}>Aucun match programmé.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {sortedMatches.map(m => (
                                    <div key={m.id} className={`bg-bg-card border-2 rounded-xl ${m.forfait ? 'border-red-500' : m.played ? 'border-purple-500' : 'border-border'}`} style={{ padding: '0.75rem' }}>
                                        <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                            <div style={{ minWidth: '60px' }}>
                                                <div className="text-xs text-text-muted">#{m.id}</div>
                                                <div className="text-purple-400 font-semibold text-xs">{m.time || '-:-'}</div>
                                                <div className="text-xs text-text-muted">{m.date || '-/-'}</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                <div className={`text-text-primary font-semibold ${m.forfait === m.team1 ? 'text-red-400' : ''}`}>
                                                    {getTeamName(m.team1)}
                                                    {m.forfait === m.team1 && <span className="text-xs text-red-500 ml-1">(F)</span>}
                                                </div>
                                                <div className="text-xs text-text-muted">{getTeamPlayers(m.team1)}</div>
                                            </div>
                                            <button onClick={() => updateLeagueMatch(m.id, 'forfait', m.forfait === m.team1 ? null : m.team1)} className={`rounded text-xs ${m.forfait === m.team1 ? 'bg-red-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.15rem 0.3rem' }}>F1</button>
                                            <ScoreInput value={m.score1} onChange={(v) => updateLeagueMatch(m.id, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateLeagueMatch(m.id, 'score2', v)} />
                                            <button onClick={() => updateLeagueMatch(m.id, 'forfait', m.forfait === m.team2 ? null : m.team2)} className={`rounded text-xs ${m.forfait === m.team2 ? 'bg-red-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.15rem 0.3rem' }}>F2</button>
                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                <div className={`text-text-primary font-semibold ${m.forfait === m.team2 ? 'text-red-400' : ''}`}>
                                                    {getTeamName(m.team2)}
                                                    {m.forfait === m.team2 && <span className="text-xs text-red-500 ml-1">(F)</span>}
                                                </div>
                                                <div className="text-xs text-text-muted">{getTeamPlayers(m.team2)}</div>
                                            </div>
                                            <button onClick={() => updateLeagueMatch(m.id, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-purple-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>
                                                {m.played ? '✅' : '⏳'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Bracket Tab */}
                {activeTab === 'bracket' && duoBracket && (() => {
                    const updateBracketMatch = (round, index, field, value) => {
                        setDuoBracket(prev => {
                            const newBracket = { ...prev };
                            if (round === 'semiFinals') {
                                newBracket.semiFinals = [...prev.semiFinals];
                                newBracket.semiFinals[index] = { ...prev.semiFinals[index], [field]: value };
                            } else if (round === 'thirdPlace') {
                                newBracket.thirdPlace = { ...prev.thirdPlace, [field]: value };
                            }
                            return newBracket;
                        });
                    };
                    const updateFinalMatch = (idx, field, value) => {
                        setDuoBracket(prev => ({
                            ...prev,
                            final: { ...prev.final, matches: prev.final.matches.map((m, i) => i === idx ? { ...m, [field]: value } : m) }
                        }));
                    };
                    return (
                        <div>
                            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                <h3 className="text-xl font-bold text-text-primary">Bracket Duo</h3>
                                <button onClick={() => saveData('/api/save-pingpong-duo-bracket', duoBracket, 'Bracket')} disabled={saving} className="bg-purple-500 text-white font-bold rounded-lg" style={{ padding: '0.75rem 1.5rem' }}>
                                    {saving ? '⏳' : '💾 Sauvegarder'}
                                </button>
                            </div>

                            {/* SF (Duo starts here, no QF) */}
                            <h4 className="font-bold text-purple-400" style={{ marginBottom: '0.5rem' }}>Demi-Finales</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {duoBracket.semiFinals.map((m, idx) => (
                                    <div key={idx} className={`bg-bg-secondary border-2 rounded-xl ${m.played ? 'border-purple-500' : 'border-border'}`} style={{ padding: '0.75rem' }}>
                                        <div className="flex items-center justify-between" style={{ gap: '0.5rem' }}>
                                            <span className="text-xs text-purple-400 font-bold">SF{idx + 1}</span>
                                            <span className="text-text-primary font-semibold text-sm">{getTeamName(m.team1)}</span>
                                            <ScoreInput value={m.score1} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score1', v)} />
                                            <span className="text-text-muted">-</span>
                                            <ScoreInput value={m.score2} onChange={(v) => updateBracketMatch('semiFinals', idx, 'score2', v)} />
                                            <span className="text-text-primary font-semibold text-sm">{getTeamName(m.team2)}</span>
                                            <button onClick={() => updateBracketMatch('semiFinals', idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-purple-500 text-white' : 'bg-bg-card text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{m.played ? '✅' : '⏳'}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 3rd Place */}
                            <h4 className="font-bold text-amber-400" style={{ marginBottom: '0.5rem' }}>🥉 Petite Finale</h4>
                            <div className={`bg-bg-secondary border-2 rounded-xl ${duoBracket.thirdPlace.played ? 'border-amber-500' : 'border-border'}`} style={{ padding: '0.75rem', marginBottom: '1.5rem' }}>
                                <div className="flex items-center justify-center" style={{ gap: '0.5rem' }}>
                                    <span className="text-text-primary font-semibold">{getTeamName(duoBracket.thirdPlace.team1)}</span>
                                    <ScoreInput value={duoBracket.thirdPlace.score1} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score1', v)} />
                                    <span className="text-text-muted">-</span>
                                    <ScoreInput value={duoBracket.thirdPlace.score2} onChange={(v) => updateBracketMatch('thirdPlace', 0, 'score2', v)} />
                                    <span className="text-text-primary font-semibold">{getTeamName(duoBracket.thirdPlace.team2)}</span>
                                    <button onClick={() => updateBracketMatch('thirdPlace', 0, 'played', !duoBracket.thirdPlace.played)} className={`rounded-lg ${duoBracket.thirdPlace.played ? 'bg-amber-500 text-bg-primary' : 'bg-bg-card text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{duoBracket.thirdPlace.played ? '✅' : '⏳'}</button>
                                </div>
                            </div>

                            {/* Final BO3 */}
                            <h4 className="font-bold text-green-400" style={{ marginBottom: '0.5rem' }}>🏆 Finale (BO5)</h4>
                            <div className="bg-gradient-to-br from-purple-900/50 to-bg-secondary border-2 border-purple-500 rounded-xl" style={{ padding: '1rem' }}>
                                <div className="text-center" style={{ marginBottom: '1rem' }}>
                                    <span className="font-bold text-text-primary">{getTeamName(duoBracket.final.team1)}</span>
                                    <span className="text-text-muted mx-2">vs</span>
                                    <span className="font-bold text-text-primary">{getTeamName(duoBracket.final.team2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    {duoBracket.final.matches.map((m, idx) => (
                                        <div key={idx} className="bg-bg-card rounded-lg" style={{ padding: '0.75rem' }}>
                                            <div className="text-xs text-text-muted text-center" style={{ marginBottom: '0.5rem' }}>Set {idx + 1}</div>
                                            <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                                <ScoreInput value={m.score1} onChange={(v) => updateFinalMatch(idx, 'score1', v)} />
                                                <span className="text-text-muted">-</span>
                                                <ScoreInput value={m.score2} onChange={(v) => updateFinalMatch(idx, 'score2', v)} />
                                                <button onClick={() => updateFinalMatch(idx, 'played', !m.played)} className={`rounded-lg ${m.played ? 'bg-purple-500 text-white' : 'bg-bg-secondary text-text-muted'}`} style={{ padding: '0.25rem 0.5rem' }}>{m.played ? '✅' : '⏳'}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    return (
        <div style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Toast */}
            {message && (
                <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-semibold shadow-lg ${message.type === 'error' ? 'bg-red-900 text-red-300' : 'bg-green-darker text-green-light'}`}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>🔐 Admin Panel</h1>
                <p className="text-sm text-text-secondary">Gestion des 3 tournois</p>
            </div>

            {/* Tournament Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                {[
                    { id: 'babyfoot', label: '⚽ Babyfoot', color: 'green' },
                    { id: 'solo', label: '🏓 Solo', color: 'blue' },
                    { id: 'duo', label: '🏓 Duo', color: 'purple' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setActiveTournament(t.id); setActiveTab(t.id === 'babyfoot' ? 'matches' : t.id === 'duo' ? 'teams' : 'players'); }}
                        className={`font-bold rounded-xl transition-all ${activeTournament === t.id
                            ? t.color === 'green' ? 'bg-green-primary text-bg-primary' : t.color === 'blue' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                            }`}
                        style={{ padding: '0.75rem 1.5rem' }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-bg-card border border-border rounded-2xl" style={{ padding: '1.5rem' }}>
                {activeTournament === 'babyfoot' && renderBabyfoot()}
                {activeTournament === 'solo' && renderSolo()}
                {activeTournament === 'duo' && renderDuo()}
            </div>
        </div>
    );
}
