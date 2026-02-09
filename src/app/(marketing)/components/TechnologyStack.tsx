interface TechnologyStackProps {
    className?: string;
}

/**
 * Technology Stack Component (Unstyled Shell)
 * Displays technology logos and stack information
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Add actual technology logos
 */
export function TechnologyStack({ className }: TechnologyStackProps) {
    const technologies = {
        frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
        ai: ['PyTorch', 'Demucs', 'ONNX Runtime', 'Tone.js'],
        infrastructure: ['Vercel', 'AWS', 'Docker', 'GitHub Actions'],
    };

    return (
        <section className={className} data-section="technology-stack">
            <h2>Built With Modern Technology</h2>
            <p className="section-description">
                Powered by industry-leading tools and frameworks.
            </p>
            <div className="tech-stack-grid">
                {Object.entries(technologies).map(([category, techs]) => (
                    <div key={category} className="tech-category">
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        <div className="tech-logos">
                            {techs.map((tech) => (
                                <div key={tech} className="tech-logo" data-tech={tech}>
                                    {/* Logo placeholder - can use actual SVG logos */}
                                    <span>{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
