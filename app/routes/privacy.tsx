export default function Privacy() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-container shadow-lg border-b border-outline-variant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-primary">
              Pump It Better
            </a>
            <a 
              href="/"
              className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-on-surface mb-8">Privacy Policy</h1>
          
          <div className="bg-surface-container rounded-xl p-6 mb-8 border border-outline-variant">
            <p className="text-on-surface-variant mb-4">
              <strong>Last Updated:</strong> September 8, 2025
            </p>
            <p className="text-on-surface-variant">
              This Privacy Policy describes how Pump It Better collects, uses, and protects your information when you use our fitness tracking application.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Our Privacy Commitment</h2>
            <div className="bg-primary-container rounded-xl p-6 border border-primary mb-4">
              <p className="text-on-primary-container font-semibold mb-2">
                Your Data Belongs to You
              </p>
              <p className="text-on-primary-container">
                We believe your fitness data is personal and valuable. We will never sell your workout data, 
                personal information, or usage patterns to third parties.
              </p>
            </div>
            <p className="text-on-surface-variant mb-4">
              Pump It Better is designed with privacy by design principles. Your workout data is stored locally 
              on your device first, giving you full control over your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Workout Data</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Exercise names, sets, reps, and weights</li>
                  <li>Workout dates and duration</li>
                  <li>Program selections and customizations</li>
                  <li>Progress measurements and personal records</li>
                  <li>Rest timer usage and workout notes</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Account Information</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Email address (for account creation and sync)</li>
                  <li>Display name or username</li>
                  <li>Account preferences and settings</li>
                  <li>Device identifiers for sync purposes</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Technical Information</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>App version and device type</li>
                  <li>Error logs and crash reports (anonymized)</li>
                  <li>Feature usage statistics (aggregated)</li>
                  <li>Sync timestamps and data integrity checks</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">How We Use Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Core Functionality</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Track your workout progress</li>
                  <li>Calculate weight progressions</li>
                  <li>Generate analytics and charts</li>
                  <li>Sync data across your devices</li>
                  <li>Provide program recommendations</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Service Improvement</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Fix bugs and improve performance</li>
                  <li>Develop new features</li>
                  <li>Understand usage patterns (aggregated)</li>
                  <li>Provide customer support</li>
                  <li>Ensure data integrity</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Data Storage and Security</h2>
            
            <div className="bg-secondary-container rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-on-secondary-container mb-3">Offline-First Architecture</h3>
              <p className="text-on-secondary-container mb-4">
                Your workout data is primarily stored locally on your device using encrypted browser storage 
                or secure app databases. This means you own your data and can access it without internet connectivity.
              </p>
              <p className="text-on-secondary-container">
                Cloud sync is optional and only occurs when you're online and logged into your account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Security Measures</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>All data transmission uses HTTPS encryption</li>
                  <li>Local data is encrypted on your device</li>
                  <li>Cloud storage uses industry-standard encryption</li>
                  <li>Regular security audits and updates</li>
                  <li>No storage of payment information (handled by app stores)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Data Sharing and Third Parties</h2>
            
            <div className="bg-error-container rounded-xl p-6 border border-error mb-6">
              <h3 className="text-xl font-bold text-on-error-container mb-3">We Do NOT Share</h3>
              <ul className="list-disc list-inside text-on-error-container space-y-2">
                <li>Your personal workout data with advertisers</li>
                <li>Individual fitness progress with any third party</li>
                <li>Personal information for marketing purposes</li>
                <li>Data with social media platforms</li>
              </ul>
            </div>

            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <h3 className="text-xl font-bold text-on-surface mb-3">Limited Sharing (When Required)</h3>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li><strong>Service Providers:</strong> Cloud infrastructure for data sync (encrypted)</li>
                <li><strong>Analytics:</strong> Anonymized, aggregated usage statistics only</li>
                <li><strong>Legal Requirements:</strong> Only if required by law</li>
                <li><strong>Safety:</strong> To prevent harm or protect rights</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Your Rights and Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Data Access</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Export all your workout data</li>
                  <li>View your complete fitness history</li>
                  <li>Download progress charts and analytics</li>
                  <li>Access raw data in CSV format</li>
                </ul>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Data Control</h3>
                <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                  <li>Delete specific workouts or exercises</li>
                  <li>Turn off cloud sync entirely</li>
                  <li>Delete your account and all data</li>
                  <li>Control data sharing preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Cookies and Tracking</h2>
            <p className="text-on-surface-variant mb-4">
              Pump It Better uses minimal cookies and tracking:
            </p>
            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li><strong>Essential Cookies:</strong> For login sessions and app functionality</li>
                <li><strong>Preferences:</strong> To remember your settings and units</li>
                <li><strong>Analytics:</strong> Basic usage statistics (anonymized)</li>
                <li><strong>No Advertising:</strong> We don't use tracking cookies for ads</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Children's Privacy</h2>
            <p className="text-on-surface-variant mb-4">
              Pump It Better is not intended for use by children under 13. We do not knowingly collect 
              personal information from children under 13. If you believe a child has provided us with 
              personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">International Users</h2>
            <p className="text-on-surface-variant mb-4">
              Pump It Better is available globally. Your data may be processed in countries other than 
              your own, but we ensure appropriate safeguards are in place to protect your privacy rights 
              regardless of location.
            </p>
            <p className="text-on-surface-variant mb-4">
              We comply with applicable privacy laws including GDPR, CCPA, and other regional privacy regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Changes to This Policy</h2>
            <p className="text-on-surface-variant mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-on-surface-variant mb-4">
              For significant changes, we may also notify you via email or through the app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">Contact Us</h2>
            <p className="text-on-surface-variant mb-4">
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <ul className="text-on-surface-variant space-y-2">
                <li><strong>Email:</strong> privacy@pumpitbetter.com</li>
                <li><strong>Support:</strong> <a href="/support" className="text-primary hover:text-primary-container transition-colors">Support Center</a></li>
                <li><strong>Data Requests:</strong> Use the export feature in app settings</li>
              </ul>
            </div>
            
            <div className="flex gap-4 mt-6">
              <a 
                href="/support"
                className="px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/terms"
                className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/"
                className="px-6 py-3 bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-container-highest transition-colors border border-outline-variant"
              >
                Return to App
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}