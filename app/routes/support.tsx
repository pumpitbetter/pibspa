export default function Support() {
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
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-on-surface mb-4">Support Center</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            Get help with Pump It Better. Find answers to common questions or get in touch with our team.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Getting Started */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-on-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Getting Started</h3>
            <p className="text-on-surface-variant mb-4">
              New to Pump It Better? Learn how to set up your first workout program and start tracking.
            </p>
            <a 
              href="/app/program/change"
              className="text-primary font-medium hover:text-primary-container transition-colors"
            >
              Choose Your Program →
            </a>
          </div>

          {/* Workout Programs */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-on-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Program Help</h3>
            <p className="text-on-surface-variant mb-4">
              Questions about 5x5, 5/3/1, PPL, or other programs? Learn how to customize and progress.
            </p>
            <a 
              href="#programs-faq"
              className="text-primary font-medium hover:text-primary-container transition-colors"
            >
              Program FAQ →
            </a>
          </div>

          {/* Technical Support */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
            <div className="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-on-tertiary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Technical Issues</h3>
            <p className="text-on-surface-variant mb-4">
              App not syncing? Offline mode issues? Get help with technical problems.
            </p>
            <a 
              href="#technical-faq"
              className="text-primary font-medium hover:text-primary-container transition-colors"
            >
              Technical FAQ →
            </a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {/* General FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-on-surface mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">How do I get started with my first workout?</h3>
                <p className="text-on-surface-variant mb-4">
                  1. Choose a program from our Pre-Built Programs (we recommend 5x5 for beginners)
                  <br />2. Set your starting weights in the program settings
                  <br />3. Go to "Today's Workout" to start your first session
                  <br />4. Follow the exercise instructions and log your sets
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Does the app work offline?</h3>
                <p className="text-on-surface-variant mb-4">
                  Yes! Pump It Better is designed offline-first. You can log workouts, track progress, and access all 
                  your programs without an internet connection. Data syncs automatically when you're back online.
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Can I customize the workout programs?</h3>
                <p className="text-on-surface-variant mb-4">
                  Absolutely! You can clone any of our programs and modify exercises, sets, reps, and progression schemes 
                  to match your goals and preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Programs FAQ */}
          <section id="programs-faq">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Program Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">What's the difference between 5x5 and 5/3/1?</h3>
                <p className="text-on-surface-variant mb-4">
                  <strong>5x5:</strong> Simple linear progression, great for beginners. 5 sets of 5 reps on main lifts.
                  <br /><br />
                  <strong>5/3/1:</strong> Percentage-based program with planned periodization. Better for intermediate+ lifters who've stalled on linear progression.
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">How does weight progression work?</h3>
                <p className="text-on-surface-variant mb-4">
                  Each program has built-in progression rules. For example, 5x5 adds 5lbs to squats/deadlifts and 2.5lbs to bench/press 
                  each successful workout. The app automatically calculates your next workout weights.
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">What if I fail a set?</h3>
                <p className="text-on-surface-variant mb-4">
                  Mark the set as failed in the app. Each program has deload protocols - for example, 5x5 deloads 10% after 
                  3 consecutive failures and works back up. The app handles this automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Technical FAQ */}
          <section id="technical-faq">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Technical Support</h2>
            
            <div className="space-y-6">
              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">My data isn't syncing between devices</h3>
                <p className="text-on-surface-variant mb-4">
                  1. Ensure you're logged into the same account on both devices
                  <br />2. Check your internet connection
                  <br />3. Try refreshing the app or restarting it
                  <br />4. Data syncs automatically when online - allow a few minutes
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">The app is running slowly</h3>
                <p className="text-on-surface-variant mb-4">
                  Try these steps:
                  <br />1. Close and restart the app
                  <br />2. Clear your browser cache (for web version)
                  <br />3. Check available storage space
                  <br />4. Update to the latest version
                </p>
              </div>

              <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                <h3 className="text-xl font-bold text-on-surface mb-3">Can I export my workout data?</h3>
                <p className="text-on-surface-variant mb-4">
                  Yes! Go to Settings → Data Management to export your workout history, progress charts, and program data 
                  in CSV format for use in other apps or backup purposes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-secondary-container/20 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-4">Still Need Help?</h2>
          <p className="text-lg text-on-surface-variant mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? We're here to help! Reach out to our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:support@pumpitbetter.com"
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              📧 Email Support
            </a>
            <a 
              href="/terms"
              className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-surface transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="/privacy"
              className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-surface transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/app"
              className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-surface transition-colors"
            >
              🏠 Return to App
            </a>
          </div>
          
          <div className="mt-6 text-sm text-on-surface-variant">
            <p>Support hours: Monday - Friday, 9 AM - 5 PM PST</p>
            <p>Average response time: 24 hours</p>
          </div>
        </section>
      </main>
    </div>
  );
}