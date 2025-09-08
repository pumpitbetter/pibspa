export default function Terms() {
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
          <h1 className="text-4xl font-bold text-on-surface mb-8">Terms of Service</h1>
          
          <div className="bg-surface-container rounded-xl p-6 mb-8 border border-outline-variant">
            <p className="text-on-surface-variant mb-4">
              <strong>Last Updated:</strong> September 8, 2025
            </p>
            <p className="text-on-surface-variant">
              These Terms of Service govern your use of Pump It Better and its services.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p className="text-on-surface-variant mb-4">
              By accessing and using Pump It Better, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Description of Service</h2>
            <p className="text-on-surface-variant mb-4">
              Pump It Better is a fitness tracking application that provides workout programs, progress tracking, 
              and analytics tools. The service includes both web and mobile applications with offline capabilities.
            </p>
            <p className="text-on-surface-variant mb-4">
              We provide proven workout programs including 5x5, 5/3/1, PPL, Madcow, and other training methodologies 
              to help users achieve their fitness goals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">3. User Responsibilities</h2>
            <p className="text-on-surface-variant mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mb-4 space-y-2">
              <li>Providing accurate information when creating your account</li>
              <li>Maintaining the security of your account credentials</li>
              <li>Using the service in accordance with applicable laws and regulations</li>
              <li>Consulting with healthcare professionals before starting any exercise program</li>
              <li>Understanding that fitness activities carry inherent risks</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Health and Safety Disclaimer</h2>
            <div className="bg-error-container rounded-xl p-6 border border-error mb-4">
              <p className="text-on-error-container font-semibold mb-2">
                Important Health Notice
              </p>
              <p className="text-on-error-container">
                Before beginning any exercise program, consult with your physician or healthcare provider. 
                Pump It Better is not responsible for any injuries or health issues that may result from using our programs.
              </p>
            </div>
            <p className="text-on-surface-variant mb-4">
              Exercise and fitness activities involve risk of injury. You participate at your own risk and are fully responsible 
              for any injuries or damages that may result from your use of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">5. Data and Privacy</h2>
            <p className="text-on-surface-variant mb-4">
              Your workout data is stored locally on your device and synced across your devices. We are committed to protecting 
              your privacy and will never sell your personal fitness data to third parties.
            </p>
            <p className="text-on-surface-variant mb-4">
              For detailed information about how we collect, use, and protect your data, please refer to our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">6. Intellectual Property</h2>
            <p className="text-on-surface-variant mb-4">
              The content, features, and functionality of Pump It Better are owned by us and are protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
            <p className="text-on-surface-variant mb-4">
              Workout programs and methodologies (5x5, 5/3/1, etc.) are based on established fitness principles and 
              are implemented with our own interpretations and features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">7. Service Availability</h2>
            <p className="text-on-surface-variant mb-4">
              While we strive to provide reliable service, Pump It Better may be temporarily unavailable due to maintenance, 
              updates, or technical issues. We are not liable for any inconvenience caused by service interruptions.
            </p>
            <p className="text-on-surface-variant mb-4">
              Our offline-first design ensures that your core workout tracking functionality remains available even when 
              internet connectivity is limited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">8. Limitation of Liability</h2>
            <p className="text-on-surface-variant mb-4">
              Pump It Better and its creators shall not be liable for any direct, indirect, incidental, special, 
              or consequential damages resulting from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">9. Modifications to Terms</h2>
            <p className="text-on-surface-variant mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes 
              through the application or email. Continued use of the service after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface mb-4">10. Contact Information</h2>
            <p className="text-on-surface-variant mb-4">
              If you have questions about these Terms of Service, please contact us through our support page.
            </p>
            <div className="flex gap-4">
              <a 
                href="/support"
                className="px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/"
                className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors"
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