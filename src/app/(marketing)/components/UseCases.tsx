interface UseCasesProps {
    className?: string;
}

/**
 * Use Cases Component (Unstyled Shell)
 * Real-world use case scenarios
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function UseCases({ className }: UseCasesProps) {
    const useCases = [
        {
            id: 1,
            title: 'Music Education',
            description: 'Students isolate instruments to learn parts, practice with backing tracks.',
            persona: 'Music Teachers & Students',
        },
        {
            id: 2,
            title: 'Karaoke & Entertainment',
            description: 'Remove vocals for karaoke, create custom backing tracks for performances.',
            persona: 'Karaoke Venues & DJs',
        },
        {
            id: 3,
            title: 'Content Creation',
            description: 'Podcasters and video creators extract clean audio for remixing and sampling.',
            persona: 'Content Creators',
        },
        {
            id: 4,
            title: 'Music Production',
            description: 'Producers analyze arrangements, create remixes, and study mixing techniques.',
            persona: 'Music Producers',
        },
    ];

    return (
        <section className={className} data-section="use-cases">
            <h2>Use Cases</h2>
            <p className="section-description">
                Trusted by educators, creators, and professionals worldwide.
            </p>
            <div className="use-cases-grid">
                {useCases.map((useCase) => (
                    <div key={useCase.id} className="use-case-card">
                        <h3>{useCase.title}</h3>
                        <p>{useCase.description}</p>
                        <span className="persona">{useCase.persona}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
