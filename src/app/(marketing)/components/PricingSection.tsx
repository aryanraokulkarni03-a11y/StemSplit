interface PricingSectionProps {
    className?: string;
}

/**
 * Pricing Section Component (Unstyled Shell)
 * Displays pricing tiers and plans
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function PricingSection({ className }: PricingSectionProps) {
    const pricingTiers = [
        {
            id: 1,
            name: 'Free',
            price: '$0',
            period: 'forever',
            features: [
                '5 songs per month',
                'Basic stem separation',
                'Standard quality',
                'Community support',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            id: 2,
            name: 'Pro',
            price: '$29',
            period: 'per month',
            features: [
                'Unlimited songs',
                'Advanced AI separation',
                'High quality exports',
                'Multi-device routing',
                'Lyric synchronization',
                'Priority support',
            ],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            id: 3,
            name: 'Enterprise',
            price: 'Custom',
            period: 'contact us',
            features: [
                'Everything in Pro',
                'API access',
                'Custom integrations',
                'SLA guarantee',
                'Dedicated support',
                'White-label options',
            ],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    return (
        <section className={className} data-section="pricing">
            <h2>Simple, Transparent Pricing</h2>
            <p className="section-description">
                Choose the plan that fits your needs. No hidden fees.
            </p>
            <div className="pricing-grid">
                {pricingTiers.map((tier) => (
                    <div
                        key={tier.id}
                        className="pricing-card"
                        data-highlighted={tier.highlighted}
                    >
                        {tier.highlighted && <span className="badge">Most Popular</span>}
                        <h3>{tier.name}</h3>
                        <div className="price">
                            <span className="amount">{tier.price}</span>
                            <span className="period">{tier.period}</span>
                        </div>
                        <ul className="features-list">
                            {tier.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                        <button className="cta-button" data-tier={tier.name.toLowerCase()}>
                            {tier.cta}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
