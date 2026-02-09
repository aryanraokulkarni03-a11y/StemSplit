interface SolutionOverviewProps {
    className?: string;
}

/**
 * Solution Overview Component (Unstyled Shell)
 * Overview of how the platform solves the problems
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function SolutionOverview({ className }: SolutionOverviewProps) {
    const solutions = [
        {
            id: 1,
            title: 'AI-Powered Separation',
            description: 'State-of-the-art neural networks for pristine stem quality.',
            icon: 'ai',
        },
        {
            id: 2,
            title: 'Multi-Device Routing',
            description: 'Route vocals to headphones, instrumentals to speakers simultaneously.',
            icon: 'routing',
        },
        {
            id: 3,
            title: 'Lyric Sync',
            description: 'Real-time lyric display with word-by-word highlighting and translations.',
            icon: 'lyrics',
        },
    ];

    return (
        <section className={className} data-section="solution-overview">
            <h2>Our Solution</h2>
            <p className="section-description">
                A comprehensive platform that combines cutting-edge AI with professional audio tools.
            </p>
            <div className="solutions-grid">
                {solutions.map((solution) => (
                    <div key={solution.id} className="solution-card" data-icon={solution.icon}>
                        <div className="solution-icon">{/* Icon placeholder */}</div>
                        <h3>{solution.title}</h3>
                        <p>{solution.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
