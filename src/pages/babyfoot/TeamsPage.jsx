import { useState, useEffect } from 'react';
import TeamCard from '../../components/TeamCard';

export default function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/babyfoot/teams.json`)
            .then(res => res.json())
            .then(data => {
                setTeams(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading teams:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Chargement des équipes...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl font-bold gradient-text" style={{ marginBottom: '0.5rem' }}>
                    ⚽ Babyfoot - Équipes
                </h1>
                <p className="text-sm text-text-secondary">8 équipes en compétition</p>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teams.map((team, index) => (
                    <TeamCard key={team.id} team={team} index={index} variant="babyfoot" />
                ))}
            </div>
        </div>
    );
}
