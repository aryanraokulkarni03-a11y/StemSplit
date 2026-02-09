interface CompetitiveAdvantageProps {
    className?: string;
}

/**
 * Competitive Advantage Component (Unstyled Shell)
 * Comparison table showing advantages over competitors
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function CompetitiveAdvantage({ className }: CompetitiveAdvantageProps) {
    const features = [
        { feature: 'AI Stem Separation', us: true, competitorA: true, competitorB: true },
        { feature: 'Multi-Device Routing', us: true, competitorA: false, competitorB: false },
        { feature: 'Lyric Synchronization', us: true, competitorA: false, competitorB: false },
        { feature: 'Pitch-Preserving Speed', us: true, competitorA: false, competitorB: true },
        { feature: 'Waveform Visualization', us: true, competitorA: true, competitorB: false },
        { feature: 'DRM & Licensing', us: true, competitorA: false, competitorB: false },
        { feature: 'API/SDK Access', us: true, competitorA: true, competitorB: false },
    ];

    return (
        <section className={className} data-section="competitive-advantage">
            <h2>Why Choose Us?</h2>
            <p className="section-description">
                7 integrated features. Competitors have 2-3.
            </p>
            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Our Platform</th>
                            <th>Competitor A</th>
                            <th>Competitor B</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.feature}</td>
                                <td data-value={row.us}>{row.us ? '✓' : '✗'}</td>
                                <td data-value={row.competitorA}>{row.competitorA ? '✓' : '✗'}</td>
                                <td data-value={row.competitorB}>{row.competitorB ? '✓' : '✗'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
