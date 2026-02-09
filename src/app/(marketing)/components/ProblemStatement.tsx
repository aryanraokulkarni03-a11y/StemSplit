interface ProblemStatementProps {
    className?: string;
}

/**
 * Problem Statement Component (Unstyled Shell)
 * Highlights pain points that the platform solves
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function ProblemStatement({ className }: ProblemStatementProps) {
    const problems = [
        {
            id: 1,
            title: 'Limited Stem Separation Quality',
            description: 'Existing tools produce low-quality separations with artifacts and bleeding.',
        },
        {
            id: 2,
            title: 'No Multi-Device Routing',
            description: 'Musicians cannot route different stems to different output devices.',
        },
        {
            id: 3,
            title: 'Missing Lyric Synchronization',
            description: 'No karaoke-style lyric display synchronized with audio playback.',
        },
    ];

    return (
        <section className={className} data-section="problem-statement">
            <h2>The Challenge</h2>
            <div className="problems-grid">
                {problems.map((problem) => (
                    <div key={problem.id} className="problem-card">
                        <h3>{problem.title}</h3>
                        <p>{problem.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
