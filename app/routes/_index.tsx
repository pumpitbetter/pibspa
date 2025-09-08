import { redirect } from "react-router";
import type { Route } from "../+types/root";
import { dbPromise } from "~/db/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PumpItBetter - Fitness Tracking Made Simple" },
    { name: "description", content: "Transform your fitness journey with intelligent tracking and powerful analytics" },
  ];
}

// Client-side loader
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // Initialize database in browser
  if (typeof window !== 'undefined') {
    try {
      const db = await dbPromise;
      if (!db) {
        console.warn("Database initialization failed, app may not work properly");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
    
    const url = new URL(window.location.href);
    
    // Check if it's app subdomain
    if (url.hostname.startsWith('app.')) {
      throw redirect("/app/queue");
    }
    
    // Check if we're in a mobile app context (Tauri/Capacitor/native)
    // Only redirect for actual mobile apps, not web development
    const isMobileApp = !!(
      (window as any).__TAURI__ || 
      (window as any).Capacitor ||
      navigator.userAgent.includes('PumpItBetter') ||
      // Check if we're running from a tauri:// protocol (actual mobile app)
      window.location.protocol.startsWith('tauri') ||
      // Check if this is a file:// URL (packaged mobile app)
      window.location.protocol === 'file:' ||
      // Check for mobile user agent with file:// protocol (mobile app context)
      (navigator.userAgent.includes('Mobile') && window.location.protocol === 'file:')
    );
    
    if (isMobileApp) {
      console.log('📱 Mobile app context detected, redirecting to /app/queue');
      throw redirect("/app/queue");
    }
  }
  return null;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Big Header */}
      <header className="bg-surface-container shadow-lg border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4 sm:mb-6">
              Pump It Better
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-6 sm:mb-8">
              Transform your fitness journey with <strong>proven programs</strong>, <strong>offline-first tracking</strong>, and <strong>powerful analytics</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
              <a 
                href="/app"
                className="w-full sm:w-60 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg text-center"
              >
                Start Your Journey
              </a>
              <button className="w-full sm:w-60 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-surface transition-colors border border-outline text-center">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Three Column Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1 - Pre-Built Programs */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl hover:bg-surface transition-all flex flex-col h-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface hover:text-on-surface mb-3 sm:mb-4">Pre-Built Programs</h3>
            <p className="text-on-surface-variant hover:text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">
              Start training immediately with proven programs: <strong>5x5, 5/3/1, PPL, Madcow, 3x8</strong>. All programs use <strong>progressive overload</strong> to auto-progress your weights and track your journey. Clone and customize any program to match your goals.
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm sm:text-base mt-auto">
              <a href="/app/program/change" className="block w-full h-full">
                View Programs
              </a>
            </button>
          </div>

          {/* Column 2 - Offline-First Tracking */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl hover:bg-surface-container-highest transition-all flex flex-col h-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Offline-First Tracking</h3>
            <p className="text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">
              Your data stays with you. Train anywhere with full offline support - log workouts in the gym, at home, or anywhere without internet. Everything syncs automatically when you're back online.
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary-container/80 hover:text-on-secondary-container transition-colors text-sm sm:text-base mt-auto">
              Start Tracking
            </button>
          </div>

          {/* Column 3 - Deep Analytics */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl hover:bg-surface transition-all flex flex-col h-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-tertiary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-tertiary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface hover:text-on-surface mb-3 sm:mb-4">Deep Analytics</h3>
            <p className="text-on-surface-variant hover:text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">
              Gain insights into your performance with comprehensive charts, progress tracking, and data-driven recommendations to optimize your training.
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-tertiary text-on-tertiary rounded-lg font-medium hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors text-sm sm:text-base mt-auto">
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="bg-secondary-container/20 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-3 sm:mb-4">Download the Mobile App</h2>
            <p className="text-lg sm:text-xl text-on-surface-variant">
              Get Pump It Better on your phone for the ultimate <strong>offline training experience</strong>. <br className="hidden sm:block"/>
              All your programs and progress sync seamlessly across iPhone, Android, and web.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
            <a 
              href="#" 
              className="block hover:opacity-80 transition-opacity"
              aria-label="Download on the App Store"
            >
              <img 
                src="/app-store-badge.svg" 
                alt="Download on the App Store" 
                className="h-16 w-52 object-contain"
              />
            </a>
            <a 
              href="#" 
              className="block hover:opacity-80 transition-opacity"
              aria-label="Get it on Google Play"
            >
              <img 
                src="/google-play-badge.png" 
                alt="Get it on Google Play" 
                className="h-23 w-58"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-container py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-on-primary-container mb-3 sm:mb-4">Trusted by Athletes Worldwide</h2>
            <p className="text-lg sm:text-xl text-on-primary-container/80">Join thousands of users who've transformed their fitness journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="bg-surface-container rounded-lg p-6 sm:p-8 shadow-lg">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-on-surface-variant font-medium text-sm sm:text-base">Active Users</div>
            </div>
            <div className="bg-surface-container rounded-lg p-6 sm:p-8 shadow-lg">
              <div className="text-3xl sm:text-4xl font-bold text-tertiary mb-2">100,000+</div>
              <div className="text-on-surface-variant font-medium text-sm sm:text-base">Workouts Logged</div>
            </div>
            <div className="bg-surface-container rounded-lg p-6 sm:p-8 shadow-lg">
              <div className="text-3xl sm:text-4xl font-bold text-on-surface mb-2">2</div>
              <div className="text-on-surface-variant font-medium text-sm sm:text-base">Mobile Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-primary mb-2">Train anywhere, sync everywhere</div>
              <p className="text-sm text-on-surface-variant">
                5x5 • 5/3/1 • PPL • Custom Programs • 100% Offline
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a 
                href="/terms" 
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/privacy" 
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/support" 
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Support
              </a>
              <a 
                href="mailto:support@pumpitbetter.com" 
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-outline-variant text-center">
            <p className="text-xs text-on-surface-variant">
              © 2025 Pump It Better LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
