import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | AI Music Platform',
    description: 'Terms of Service for AI Music Platform - Legal agreement for using our services',
};

// Incremental Static Regeneration - revalidate every hour
export const revalidate = 3600;

export default function TermsPage() {
    return (
        <div className="terms-of-service" data-page="terms">
            <div className="terms-container">
                <header className="terms-header">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last Updated: February 9, 2026</p>
                </header>

                <section id="acceptance" data-section="acceptance">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using AI Music Platform ("Service"), you agree to be bound by these Terms of Service
                        ("Terms"). If you do not agree to these Terms, do not use the Service.
                    </p>
                    <p>
                        These Terms constitute a legally binding agreement between you and AI Music Platform ("we," "us," or "our").
                    </p>
                </section>

                <section id="service-description" data-section="service-description">
                    <h2>2. Service Description</h2>
                    <p>
                        AI Music Platform provides AI-powered audio separation services, allowing users to:
                    </p>
                    <ul>
                        <li>Upload audio files for stem separation</li>
                        <li>Separate vocals, instruments, and other audio components</li>
                        <li>Download separated audio stems</li>
                        <li>Route audio to multiple output devices</li>
                    </ul>
                    <p>
                        We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
                    </p>
                </section>

                <section id="user-accounts" data-section="user-accounts">
                    <h2>3. User Accounts</h2>

                    <h3>3.1 Account Creation</h3>
                    <p>To use certain features, you must create an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of unauthorized access</li>
                        <li>Be responsible for all activities under your account</li>
                    </ul>

                    <h3>3.2 Account Termination</h3>
                    <p>We may suspend or terminate your account if you:</p>
                    <ul>
                        <li>Violate these Terms</li>
                        <li>Engage in fraudulent or illegal activities</li>
                        <li>Abuse or misuse the Service</li>
                        <li>Fail to pay applicable fees</li>
                    </ul>
                </section>

                <section id="acceptable-use" data-section="acceptable-use">
                    <h2>4. Acceptable Use</h2>
                    <p>You agree NOT to:</p>
                    <ul>
                        <li>Upload content you don't have rights to</li>
                        <li>Violate copyright or intellectual property rights</li>
                        <li>Upload malicious files or malware</li>
                        <li>Attempt to reverse engineer the Service</li>
                        <li>Use the Service for illegal purposes</li>
                        <li>Harass, abuse, or harm others</li>
                        <li>Spam or send unsolicited communications</li>
                        <li>Circumvent security measures</li>
                    </ul>
                    <p>See our <a href="/acceptable-use">Acceptable Use Policy</a> for details.</p>
                </section>

                <section id="intellectual-property" data-section="intellectual-property">
                    <h2>5. Intellectual Property</h2>

                    <h3>5.1 Your Content</h3>
                    <p>You retain all rights to content you upload. By uploading, you grant us a limited license to:</p>
                    <ul>
                        <li>Process your audio files</li>
                        <li>Store files temporarily (up to 24 hours)</li>
                        <li>Provide the separation service</li>
                    </ul>

                    <h3>5.2 Our Content</h3>
                    <p>The Service, including software, algorithms, and UI, is owned by us and protected by copyright and other laws.</p>

                    <h3>5.3 Trademarks</h3>
                    <p>All trademarks, logos, and service marks are the property of their respective owners.</p>
                </section>

                <section id="payment" data-section="payment">
                    <h2>6. Payment and Fees</h2>

                    <h3>6.1 Pricing</h3>
                    <p>We offer free and paid plans. Current pricing is available on our <a href="/#pricing">Pricing page</a>.</p>

                    <h3>6.2 Billing</h3>
                    <ul>
                        <li>Subscriptions are billed monthly or annually</li>
                        <li>Payments are processed securely through third-party providers</li>
                        <li>All fees are non-refundable unless required by law</li>
                    </ul>

                    <h3>6.3 Cancellation</h3>
                    <p>You may cancel your subscription at any time. Access continues until the end of the billing period.</p>
                </section>

                <section id="disclaimers" data-section="disclaimers">
                    <h2>7. Disclaimers</h2>
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
                        BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>We do not guarantee:</p>
                    <ul>
                        <li>Uninterrupted or error-free service</li>
                        <li>Perfect audio separation quality</li>
                        <li>Compatibility with all audio formats</li>
                        <li>Availability of the Service at all times</li>
                    </ul>
                </section>

                <section id="limitation-liability" data-section="limitation-liability">
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE.
                    </p>
                    <p>
                        OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                    </p>
                </section>

                <section id="indemnification" data-section="indemnification">
                    <h2>9. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
                    </p>
                    <ul>
                        <li>Your use of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any rights of others</li>
                        <li>Content you upload</li>
                    </ul>
                </section>

                <section id="dispute-resolution" data-section="dispute-resolution">
                    <h2>10. Dispute Resolution</h2>

                    <h3>10.1 Governing Law</h3>
                    <p>These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.</p>

                    <h3>10.2 Arbitration</h3>
                    <p>
                        Any disputes shall be resolved through binding arbitration, except where prohibited by law.
                        You waive your right to a jury trial.
                    </p>

                    <h3>10.3 Class Action Waiver</h3>
                    <p>You agree to resolve disputes individually and waive the right to participate in class actions.</p>
                </section>

                <section id="modifications" data-section="modifications">
                    <h2>11. Modifications to Terms</h2>
                    <p>
                        We may modify these Terms at any time. We will notify you of material changes by:
                    </p>
                    <ul>
                        <li>Posting the updated Terms on this page</li>
                        <li>Updating the "Last Updated" date</li>
                        <li>Sending email notification (for significant changes)</li>
                    </ul>
                    <p>
                        Your continued use after changes constitutes acceptance of the updated Terms.
                    </p>
                </section>

                <section id="general" data-section="general">
                    <h2>12. General Provisions</h2>

                    <h3>12.1 Entire Agreement</h3>
                    <p>These Terms constitute the entire agreement between you and us regarding the Service.</p>

                    <h3>12.2 Severability</h3>
                    <p>If any provision is found invalid, the remaining provisions remain in effect.</p>

                    <h3>12.3 No Waiver</h3>
                    <p>Our failure to enforce any right does not waive that right.</p>

                    <h3>12.4 Assignment</h3>
                    <p>You may not assign these Terms. We may assign them to an affiliate or successor.</p>
                </section>

                <section id="contact" data-section="contact">
                    <h2>13. Contact Information</h2>
                    <p>For questions about these Terms, contact us:</p>
                    <ul>
                        <li><strong>Email:</strong> legal@aimusicplatform.com</li>
                        <li><strong>Address:</strong> [Your Company Address]</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
