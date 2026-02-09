interface TechnicalArchitectureProps {
    className?: string;
}

/**
 * Technical Architecture Component (Unstyled Shell)
 * System architecture diagram and technical overview
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Add Mermaid diagram or custom SVG diagram
 */
export function TechnicalArchitecture({ className }: TechnicalArchitectureProps) {
    const architectureLayers = [
        {
            id: 1,
            layer: 'Client Layer',
            components: ['Web App', 'Mobile App', 'SDK'],
        },
        {
            id: 2,
            layer: 'API Layer',
            components: ['REST API', 'WebSocket', 'GraphQL'],
        },
        {
            id: 3,
            layer: 'Processing Layer',
            components: ['AI Engine', 'Audio Processor', 'Lyric Sync'],
        },
        {
            id: 4,
            layer: 'Data Layer',
            components: ['PostgreSQL', 'Redis Cache', 'Object Storage'],
        },
    ];

    return (
        <section className={className} data-section="technical-architecture">
            <h2>Technical Architecture</h2>
            <p className="section-description">
                Built on a scalable, modern architecture designed for performance and reliability.
            </p>
            <div className="architecture-diagram">
                {/* Diagram placeholder - can use Mermaid or custom SVG */}
                <div className="architecture-layers">
                    {architectureLayers.map((layer) => (
                        <div key={layer.id} className="architecture-layer">
                            <h3>{layer.layer}</h3>
                            <ul>
                                {layer.components.map((component, idx) => (
                                    <li key={idx}>{component}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
