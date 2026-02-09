import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'Cookie Policy for AI Music Platform - How we use cookies and tracking technologies',
};

// Incremental Static Regeneration - revalidate every hour
export const revalidate = 3600;

export default function CookiePolicyPage() {
    return (
        <div className="cookie-policy" data-page="cookies">
            <div className="cookie-container">
                <header className="cookie-header">
                    <h1>Cookie Policy</h1>
                    <p className="last-updated">Last Updated: February 9, 2026</p>
                </header>

                <section id="introduction" data-section="introduction">
                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files stored on your device when you visit a website. They help websites
                        remember your preferences and improve your experience.
                    </p>
                    <p>
                        This Cookie Policy explains how AI Music Platform uses cookies and similar tracking technologies.
                    </p>
                </section>

                <section id="cookie-types" data-section="cookie-types">
                    <h2>2. Types of Cookies We Use</h2>

                    <div className="cookie-table">
                        <h3>2.1 Essential Cookies</h3>
                        <p><strong>Purpose:</strong> Required for the website to function</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cookie Name</th>
                                    <th>Purpose</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>next-auth.session-token</td>
                                    <td>Authentication and session management</td>
                                    <td>30 days</td>
                                </tr>
                                <tr>
                                    <td>next-auth.csrf-token</td>
                                    <td>CSRF protection</td>
                                    <td>Session</td>
                                </tr>
                                <tr>
                                    <td>cookie-consent</td>
                                    <td>Remember your cookie preferences</td>
                                    <td>1 year</td>
                                </tr>
                            </tbody>
                        </table>
                        <p><em>These cookies cannot be disabled as they are essential for the service.</em></p>
                    </div>

                    <div className="cookie-table">
                        <h3>2.2 Functional Cookies</h3>
                        <p><strong>Purpose:</strong> Remember your preferences and settings</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cookie Name</th>
                                    <th>Purpose</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>theme-preference</td>
                                    <td>Remember dark/light mode preference</td>
                                    <td>1 year</td>
                                </tr>
                                <tr>
                                    <td>language-preference</td>
                                    <td>Remember language selection</td>
                                    <td>1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="cookie-table">
                        <h3>2.3 Analytics Cookies</h3>
                        <p><strong>Purpose:</strong> Understand how you use our website</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cookie Name</th>
                                    <th>Provider</th>
                                    <th>Purpose</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>_ga</td>
                                    <td>Google Analytics</td>
                                    <td>Distinguish users</td>
                                    <td>2 years</td>
                                </tr>
                                <tr>
                                    <td>_ga_*</td>
                                    <td>Google Analytics</td>
                                    <td>Persist session state</td>
                                    <td>2 years</td>
                                </tr>
                                <tr>
                                    <td>_gid</td>
                                    <td>Google Analytics</td>
                                    <td>Distinguish users</td>
                                    <td>24 hours</td>
                                </tr>
                            </tbody>
                        </table>
                        <p><em>These cookies require your consent and can be disabled.</em></p>
                    </div>

                    <div className="cookie-table">
                        <h3>2.4 Marketing Cookies</h3>
                        <p><strong>Purpose:</strong> Deliver relevant advertisements</p>
                        <p><em>We currently do not use marketing cookies. This section is reserved for future use.</em></p>
                    </div>
                </section>

                <section id="third-party" data-section="third-party">
                    <h2>3. Third-Party Cookies</h2>
                    <p>We use the following third-party services that may set cookies:</p>
                    <ul>
                        <li>
                            <strong>Google Analytics:</strong> Website analytics
                            <br />
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                                Google Privacy Policy
                            </a>
                        </li>
                        <li>
                            <strong>Vercel Analytics:</strong> Performance monitoring
                            <br />
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                                Vercel Privacy Policy
                            </a>
                        </li>
                    </ul>
                </section>

                <section id="cookie-management" data-section="cookie-management">
                    <h2>4. How to Manage Cookies</h2>

                    <h3>4.1 Cookie Consent Banner</h3>
                    <p>
                        When you first visit our website, you'll see a cookie consent banner. You can:
                    </p>
                    <ul>
                        <li><strong>Accept:</strong> Allow all cookies</li>
                        <li><strong>Reject:</strong> Only essential cookies will be used</li>
                    </ul>

                    <h3>4.2 Browser Settings</h3>
                    <p>You can control cookies through your browser settings:</p>
                    <ul>
                        <li>
                            <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                        </li>
                        <li>
                            <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                        </li>
                        <li>
                            <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                        </li>
                        <li>
                            <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
                        </li>
                    </ul>

                    <h3>4.3 Opt-Out Tools</h3>
                    <p>You can opt out of Google Analytics:</p>
                    <ul>
                        <li>
                            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                                Google Analytics Opt-out Browser Add-on
                            </a>
                        </li>
                    </ul>
                </section>

                <section id="impact" data-section="impact">
                    <h2>5. Impact of Disabling Cookies</h2>
                    <p>If you disable cookies:</p>
                    <ul>
                        <li><strong>Essential cookies:</strong> The website may not function properly</li>
                        <li><strong>Functional cookies:</strong> Your preferences won't be saved</li>
                        <li><strong>Analytics cookies:</strong> We won't be able to improve the service based on usage data</li>
                    </ul>
                </section>

                <section id="updates" data-section="updates">
                    <h2>6. Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time. Changes will be posted on this page with
                        an updated "Last Updated" date.
                    </p>
                </section>

                <footer className="cookie-footer">
                    <h2>Contact Us</h2>
                    <p>If you have questions about our use of cookies, contact us:</p>
                    <ul>
                        <li><strong>Email:</strong> privacy@aimusicplatform.com</li>
                        <li><strong>Privacy Policy:</strong> <a href="/privacy">View Privacy Policy</a></li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}
