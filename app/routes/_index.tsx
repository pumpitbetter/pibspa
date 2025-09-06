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
  // This renders the marketing homepage in SSR mode
  return (
    <div className="min-h-screen bg-surface">z 
      {/* Marketing Homepage */}
      <header className="bg-surface-container shadow-lg border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4 sm:mb-6">
              Pump It Better
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-6 sm:mb-8">
              Transform your fitness journey with intelligent tracking, powerful analytics, and seamless cross-platform sync
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
              <a 
                href="/app"
                className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg text-center"
              >
                Launch App
              </a>
              <a 
                href="/marketing/pricing"
                className="w-full sm:w-auto px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors border border-outline text-center"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Quick feature highlights */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Smart Tracking</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
              Effortlessly log workouts and track your fitness journey with intelligent analytics.
            </p>
          </div>

          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Offline First</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
              Your data stays with you. Train anywhere with full offline support and cloud sync.
            </p>
          </div>

          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Cross Platform</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
              Available on iOS, Android, and the web. Your progress syncs seamlessly everywhere.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
