import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acceptable Use Policy',
    description: 'Acceptable Use Policy for AI Music Platform - Guidelines for proper use of our service',
};

// Incremental Static Regeneration - revalidate every hour
export const revalidate = 3600;

export default function AcceptableUsePage() {
    return (
        <div className="acceptable-use-policy" data-page="acceptable-use">
            <div className="aup-container">
                <header className="aup-header">
                    <h1>Acceptable Use Policy</h1>
                    <p className="last-updated">Last Updated: February 9, 2026</p>
                </header>

                <section id="introduction" data-section="introduction">
                    <h2>1. Introduction</h2>
                    <p>
                        This Acceptable Use Policy ("AUP") governs your use of AI Music Platform's services.
                        By using our services, you agree to comply with this policy.
                    </p>
                    <p>
                        Violations may result in suspension or termination of your account and legal action if necessary.
                    </p>
                </section>

                <section id="permitted-use" data-section="permitted-use">
                    <h2>2. Permitted Activities</h2>
                    <p>You may use our services to:</p>
                    <ul>
                        <li>Separate audio stems from your own music or music you have rights to</li>
                        <li>Create remixes, covers, or derivative works (with proper licensing)</li>
                        <li>Produce educational content</li>
                        <li>Conduct research and development</li>
                        <li>Create karaoke tracks from licensed music</li>
                        <li>Isolate vocals or instruments for practice</li>
                        <li>Enhance audio quality for personal or professional projects</li>
                    </ul>
                </section>

                <section id="prohibited-use" data-section="prohibited-use">
                    <h2>3. Prohibited Activities</h2>

                    <h3>3.1 Copyright and Intellectual Property Violations</h3>
                    <p>You may NOT:</p>
                    <ul>
                        <li>Upload copyrighted content without proper authorization</li>
                        <li>Distribute separated stems of copyrighted music without permission</li>
                        <li>Create unauthorized derivative works</li>
                        <li>Violate any intellectual property rights</li>
                        <li>Remove or alter copyright notices or watermarks</li>
                    </ul>

                    <h3>3.2 Illegal Activities</h3>
                    <p>You may NOT use our services to:</p>
                    <ul>
                        <li>Engage in any illegal activities</li>
                        <li>Facilitate piracy or copyright infringement</li>
                        <li>Distribute illegal content</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Evade law enforcement or legal obligations</li>
                    </ul>

                    <h3>3.3 Harmful Content</h3>
                    <p>You may NOT upload or process:</p>
                    <ul>
                        <li>Content promoting violence, hate speech, or discrimination</li>
                        <li>Sexually explicit or pornographic content</li>
                        <li>Content exploiting or harming minors</li>
                        <li>Content promoting terrorism or extremism</li>
                        <li>Malicious files, malware, or viruses</li>
                    </ul>

                    <h3>3.4 Abuse and Harassment</h3>
                    <p>You may NOT:</p>
                    <ul>
                        <li>Harass, threaten, or abuse other users</li>
                        <li>Impersonate others or misrepresent your identity</li>
                        <li>Stalk or invade others' privacy</li>
                        <li>Send spam or unsolicited communications</li>
                    </ul>

                    <h3>3.5 System Abuse</h3>
                    <p>You may NOT:</p>
                    <ul>
                        <li>Attempt to reverse engineer our algorithms or software</li>
                        <li>Circumvent security measures or access controls</li>
                        <li>Overload or disrupt our systems (DDoS attacks)</li>
                        <li>Use automated tools to scrape or harvest data</li>
                        <li>Create multiple accounts to abuse free tier limits</li>
                        <li>Share account credentials with others</li>
                        <li>Use the service for cryptocurrency mining</li>
                    </ul>

                    <h3>3.6 Commercial Misuse</h3>
                    <p>You may NOT:</p>
                    <ul>
                        <li>Resell our services without authorization</li>
                        <li>Use our services to compete with us</li>
                        <li>Offer our services as part of your own product without a partnership agreement</li>
                        <li>Use free tier accounts for commercial purposes</li>
                    </ul>
                </section>

                <section id="content-guidelines" data-section="content-guidelines">
                    <h2>4. Content Guidelines</h2>

                    <h3>4.1 Ownership and Rights</h3>
                    <p>You must:</p>
                    <ul>
                        <li>Own the content you upload OR have proper authorization</li>
                        <li>Ensure you have rights to process and download separated stems</li>
                        <li>Respect copyright and licensing agreements</li>
                        <li>Obtain necessary permissions for commercial use</li>
                    </ul>

                    <h3>4.2 File Requirements</h3>
                    <p>Uploaded files must:</p>
                    <ul>
                        <li>Be in supported audio formats (MP3, WAV, FLAC, etc.)</li>
                        <li>Not exceed size limits (varies by plan)</li>
                        <li>Not contain malicious code or viruses</li>
                        <li>Be actual audio files (not disguised executables)</li>
                    </ul>
                </section>

                <section id="enforcement" data-section="enforcement">
                    <h2>5. Enforcement</h2>

                    <h3>5.1 Monitoring</h3>
                    <p>We reserve the right to:</p>
                    <ul>
                        <li>Monitor usage for compliance with this AUP</li>
                        <li>Investigate suspected violations</li>
                        <li>Review uploaded content if flagged</li>
                        <li>Use automated tools to detect abuse</li>
                    </ul>

                    <h3>5.2 Violations</h3>
                    <p>If you violate this AUP, we may:</p>
                    <ul>
                        <li>Issue a warning</li>
                        <li>Temporarily suspend your account</li>
                        <li>Permanently terminate your account</li>
                        <li>Delete your content</li>
                        <li>Report illegal activities to authorities</li>
                        <li>Pursue legal action for damages</li>
                    </ul>

                    <h3>5.3 Appeals</h3>
                    <p>
                        If you believe your account was suspended or terminated in error, you may appeal by contacting
                        us at <strong>appeals@aimusicplatform.com</strong> within 30 days.
                    </p>
                </section>

                <section id="reporting" data-section="reporting">
                    <h2>6. Reporting Violations</h2>
                    <p>
                        If you become aware of any violations of this AUP, please report them to:
                    </p>
                    <ul>
                        <li><strong>Email:</strong> abuse@aimusicplatform.com</li>
                        <li><strong>Subject:</strong> "AUP Violation Report"</li>
                        <li><strong>Include:</strong> Detailed description, evidence, and your contact information</li>
                    </ul>
                    <p>
                        We will investigate all reports and take appropriate action.
                    </p>
                </section>

                <section id="copyright" data-section="copyright">
                    <h2>7. Copyright Infringement (DMCA)</h2>
                    <p>
                        We respect intellectual property rights. If you believe your copyrighted work has been infringed,
                        please submit a DMCA takedown notice to:
                    </p>
                    <ul>
                        <li><strong>Email:</strong> dmca@aimusicplatform.com</li>
                        <li><strong>Subject:</strong> "DMCA Takedown Notice"</li>
                    </ul>
                    <p>Your notice must include:</p>
                    <ul>
                        <li>Identification of the copyrighted work</li>
                        <li>Identification of the infringing material</li>
                        <li>Your contact information</li>
                        <li>A statement of good faith belief</li>
                        <li>A statement under penalty of perjury</li>
                        <li>Your physical or electronic signature</li>
                    </ul>
                </section>

                <section id="updates" data-section="updates">
                    <h2>8. Updates to This Policy</h2>
                    <p>
                        We may update this AUP from time to time. Changes will be posted on this page with an updated
                        "Last Updated" date. Your continued use constitutes acceptance of the updated policy.
                    </p>
                </section>

                <footer className="aup-footer">
                    <h2>Contact Us</h2>
                    <p>For questions about this Acceptable Use Policy, contact us:</p>
                    <ul>
                        <li><strong>General Inquiries:</strong> legal@aimusicplatform.com</li>
                        <li><strong>Abuse Reports:</strong> abuse@aimusicplatform.com</li>
                        <li><strong>DMCA Notices:</strong> dmca@aimusicplatform.com</li>
                        <li><strong>Appeals:</strong> appeals@aimusicplatform.com</li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}
