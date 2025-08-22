import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "PumpItBetter - Your Fitness Journey Starts Here" },
    { name: "description", content: "The complete fitness tracking solution for serious athletes" },
  ];
};

// Server-side loader - works in SSR mode
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Example: fetch marketing data from database
  const marketingData = {
    title: "PumpItBetter - Your Fitness Journey Starts Here",
    features: [
      "Track workouts across all devices",
      "Progress analytics and charts", 
      "Offline-first design",
      "Cross-platform sync"
    ],
    stats: {
      users: "10,000+",
      workouts: "100,000+", 
      platforms: "iOS, Android, Web"
    }
  };
  
  return { marketingData };
}

// Server-side action - handle form submissions  
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  
  // Example: save to database, send to mailing list
  console.log("New signup:", email);
  
  // You could integrate with your database here
  // await db.mailingList.create({ email });
  
  return { success: true, message: "Thanks for signing up!" };
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
              Transform your fitness journey with intelligent tracking, powerful analytics, and seamless cross-platform sync
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
              <button className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg">
                Start Your Journey
              </button>
              <button className="w-full sm:w-auto px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors border border-outline">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Three Column Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1 - Track Everything */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Smart Tracking</h3>
            <p className="text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Effortlessly log workouts, track progress, and monitor your fitness journey with our intelligent tracking system that adapts to your routine.
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm sm:text-base">
              Explore Tracking
            </button>
          </div>

          {/* Column 2 - Powerful Analytics */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-tertiary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-tertiary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Deep Analytics</h3>
            <p className="text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Gain insights into your performance with comprehensive charts, progress tracking, and data-driven recommendations to optimize your training.
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-tertiary text-on-tertiary rounded-lg font-medium hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors text-sm sm:text-base">
              View Analytics
            </button>
          </div>

          {/* Column 3 - Mobile Apps */}
          <div className="bg-surface-container rounded-xl shadow-lg p-6 sm:p-8 border border-outline-variant hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary-container rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-on-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 sm:mb-4">Download the App</h3>
            <p className="text-on-surface-variant mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Get Pump It Better on your iPhone or Android device. Train anywhere with offline-first design and seamless cloud synchronization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                  className="h-18 w-58"
                />
              </a>
            </div>
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
    </div>
  );
}