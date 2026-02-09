import type { Metadata } from 'next';

export const metadata = {
    title: 'Privacy Policy | AI Music Platform',
    description: 'Privacy Policy for AI Music Platform - How we collect, use, and protect your data',
};

// Incremental Static Regeneration - revalidate every hour
export const revalidate = 3600;

export default function PrivacyPage() {
    return (
        <div className="privacy-policy" data-page="privacy">
            <div className="privacy-container">
                <header className="privacy-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: February 9, 2026</p>
                </header>

                <nav className="table-of-contents" data-section="toc">
                    <h2>Table of Contents</h2>
                    <ol>
                        <li><a href="#introduction">Introduction</a></li>
                        <li><a href="#data-collection">Data We Collect</a></li>
                        <li><a href="#data-usage">How We Use Your Data</a></li>
                        <li><a href="#data-sharing">Data Sharing and Disclosure</a></li>
                        <li><a href="#data-storage">Data Storage and Security</a></li>
                        <li><a href="#your-rights">Your Rights</a></li>
                        <li><a href="#cookies">Cookies and Tracking</a></li>
                        <li><a href="#third-party">Third-Party Services</a></li>
                        <li><a href="#children">Children's Privacy</a></li>
                        <li><a href="#changes">Changes to This Policy</a></li>
                    </ol>
                </nav>

                <section id="introduction" data-section="introduction">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to AI Music Platform ("we," "our," or "us"). We are committed to protecting your privacy
                        and ensuring transparency in how we collect, use, and safeguard your personal information.
                    </p>
                    <p>
                        This Privacy Policy explains our practices regarding data collection and processing in compliance
                        with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and
                        other applicable privacy laws.
                    </p>
                    <p>
                        By using our services, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </section>

                <section id="data-collection" data-section="data-collection">
                    <h2>2. Data We Collect</h2>

                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                        <li><strong>Profile Information:</strong> Optional profile details, preferences</li>
                        <li><strong>Demo Requests:</strong> Name, email, company, message</li>
                        <li><strong>Contact Forms:</strong> Name, email, subject, message</li>
                    </ul>

                    <h3>2.2 Automatically Collected Information</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
                        <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
                        <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
                    </ul>

                    <h3>2.3 Audio Processing Data</h3>
                    <ul>
                        <li><strong>Uploaded Files:</strong> Audio files you upload for processing (temporary storage)</li>
                        <li><strong>Processing Metadata:</strong> File size, format, processing parameters</li>
                        <li><strong>Results:</strong> Separated audio stems (temporary storage)</li>
                    </ul>
                </section>

                <section id="data-usage" data-section="data-usage">
                    <h2>3. How We Use Your Data</h2>

                    <h3>3.1 Service Provision</h3>
                    <ul>
                        <li>Provide and maintain our audio separation services</li>
                        <li>Process your audio files and deliver results</li>
                        <li>Manage your account and authentication</li>
                        <li>Respond to your inquiries and support requests</li>
                    </ul>

                    <h3>3.2 Service Improvement</h3>
                    <ul>
                        <li>Analyze usage patterns to improve our services</li>
                        <li>Develop new features and functionality</li>
                        <li>Conduct research and development</li>
                        <li>Monitor and analyze trends and usage</li>
                    </ul>

                    <h3>3.3 Communication</h3>
                    <ul>
                        <li>Send service-related notifications</li>
                        <li>Respond to demo requests and inquiries</li>
                        <li>Send important updates about our services</li>
                        <li>Marketing communications (with your consent)</li>
                    </ul>

                    <h3>3.4 Legal Compliance</h3>
                    <ul>
                        <li>Comply with legal obligations</li>
                        <li>Protect our rights and property</li>
                        <li>Prevent fraud and abuse</li>
                        <li>Enforce our Terms of Service</li>
                    </ul>
                </section>

                <section id="data-sharing" data-section="data-sharing">
                    <h2>4. Data Sharing and Disclosure</h2>

                    <p>We do not sell your personal data. We may share your information in the following circumstances:</p>

                    <h3>4.1 Service Providers</h3>
                    <ul>
                        <li><strong>Cloud Hosting:</strong> Vercel, AWS (infrastructure)</li>
                        <li><strong>Database:</strong> Supabase, Neon (data storage)</li>
                        <li><strong>Email Service:</strong> Resend (transactional emails)</li>
                        <li><strong>Analytics:</strong> Google Analytics, Vercel Analytics</li>
                    </ul>

                    <h3>4.2 Legal Requirements</h3>
                    <p>We may disclose your information if required by law or in response to valid legal requests.</p>

                    <h3>4.3 Business Transfers</h3>
                    <p>In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</p>
                </section>

                <section id="data-storage" data-section="data-storage">
                    <h2>5. Data Storage and Security</h2>

                    <h3>5.1 Security Measures</h3>
                    <ul>
                        <li>Encryption in transit (HTTPS/TLS)</li>
                        <li>Encryption at rest for sensitive data</li>
                        <li>Password hashing (bcrypt)</li>
                        <li>Regular security audits</li>
                        <li>Access controls and authentication</li>
                    </ul>

                    <h3>5.2 Data Retention</h3>
                    <ul>
                        <li><strong>Account Data:</strong> Retained until account deletion</li>
                        <li><strong>Audio Files:</strong> Deleted within 24 hours of processing</li>
                        <li><strong>Logs:</strong> Retained for 90 days</li>
                        <li><strong>Backups:</strong> Retained for 30 days</li>
                    </ul>

                    <h3>5.3 Data Location</h3>
                    <p>Your data is stored on servers located in the United States and European Union.</p>
                </section>

                <section id="your-rights" data-section="your-rights">
                    <h2>6. Your Rights</h2>

                    <h3>6.1 GDPR Rights (EU Users)</h3>
                    <ul>
                        <li><strong>Right to Access:</strong> Request a copy of your data</li>
                        <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
                        <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                        <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                        <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
                        <li><strong>Right to Object:</strong> Object to certain data processing</li>
                        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
                    </ul>

                    <h3>6.2 CCPA Rights (California Users)</h3>
                    <ul>
                        <li><strong>Right to Know:</strong> What personal information we collect</li>
                        <li><strong>Right to Delete:</strong> Request deletion of your information</li>
                        <li><strong>Right to Opt-Out:</strong> Opt-out of sale of personal information (we don't sell data)</li>
                        <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                    </ul>

                    <h3>6.3 Exercising Your Rights</h3>
                    <p>To exercise your rights:</p>
                    <ul>
                        <li>Visit your account settings</li>
                        <li>Use our data export tool: <code>/api/user/export</code></li>
                        <li>Use our account deletion tool: <code>/api/user/delete</code></li>
                        <li>Contact us at: privacy@aimusicplatform.com</li>
                    </ul>
                </section>

                <section id="cookies" data-section="cookies">
                    <h2>7. Cookies and Tracking</h2>

                    <p>We use cookies and similar tracking technologies. See our <a href="/cookies">Cookie Policy</a> for details.</p>

                    <h3>7.1 Cookie Types</h3>
                    <ul>
                        <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
                        <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                        <li><strong>Analytics Cookies:</strong> Understand how you use our service</li>
                        <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
                    </ul>

                    <h3>7.2 Cookie Management</h3>
                    <p>You can control cookies through our cookie consent banner or your browser settings.</p>
                </section>

                <section id="third-party" data-section="third-party">
                    <h2>8. Third-Party Services</h2>

                    <p>We use the following third-party services:</p>
                    <ul>
                        <li><strong>Google Analytics:</strong> Website analytics</li>
                        <li><strong>Vercel Analytics:</strong> Performance monitoring</li>
                        <li><strong>Resend:</strong> Email delivery</li>
                        <li><strong>OAuth Providers:</strong> Google, GitHub (optional login)</li>
                    </ul>

                    <p>These services have their own privacy policies. We are not responsible for their practices.</p>
                </section>

                <section id="children" data-section="children">
                    <h2>9. Children's Privacy</h2>

                    <p>
                        Our services are not intended for children under 13 years of age. We do not knowingly collect
                        personal information from children under 13.
                    </p>
                    <p>
                        If you believe we have collected information from a child under 13, please contact us immediately,
                        and we will delete the information.
                    </p>
                </section>

                <section id="changes" data-section="changes">
                    <h2>10. Changes to This Policy</h2>

                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes by:
                    </p>
                    <ul>
                        <li>Posting the new policy on this page</li>
                        <li>Updating the "Last Updated" date</li>
                        <li>Sending an email notification (for material changes)</li>
                    </ul>
                    <p>
                        Your continued use of our services after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                <footer className="privacy-footer">
                    <h2>Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us:</p>
                    <ul>
                        <li><strong>Email:</strong> privacy@aimusicplatform.com</li>
                        <li><strong>Address:</strong> [Your Company Address]</li>
                        <li><strong>Data Protection Officer:</strong> dpo@aimusicplatform.com</li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}
