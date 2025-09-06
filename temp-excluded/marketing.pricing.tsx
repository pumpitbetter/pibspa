import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Pricing - PumpItBetter" },
    { name: "description", content: "Choose the perfect plan for your fitness journey" },
  ];
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-on-surface mb-4">Choose Your Plan</h1>
          <p className="text-xl text-on-surface-variant">Start your fitness journey today</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-surface-container rounded-xl shadow-lg p-8 border border-outline-variant">
            <h3 className="text-2xl font-bold text-on-surface mb-4">Free</h3>
            <div className="text-4xl font-bold text-primary mb-6">$0</div>
            <ul className="space-y-3 mb-8">
              <li className="text-on-surface-variant">✓ Basic workout tracking</li>
              <li className="text-on-surface-variant">✓ Simple analytics</li>
              <li className="text-on-surface-variant">✓ Mobile app access</li>
            </ul>
            <a 
              href="/app/queue"
              className="block w-full text-center px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan */}
          <div className="bg-surface-container rounded-xl shadow-lg p-8 border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-on-primary px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Pro</h3>
            <div className="text-4xl font-bold text-primary mb-6">$9.99<span className="text-lg text-on-surface-variant">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="text-on-surface-variant">✓ Advanced analytics</li>
              <li className="text-on-surface-variant">✓ Custom programs</li>
              <li className="text-on-surface-variant">✓ Progress photos</li>
              <li className="text-on-surface-variant">✓ Priority support</li>
            </ul>
            <button className="block w-full text-center px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors">
              Start Pro Trial
            </button>
          </div>

          {/* Team Plan */}
          <div className="bg-surface-container rounded-xl shadow-lg p-8 border border-outline-variant">
            <h3 className="text-2xl font-bold text-on-surface mb-4">Team</h3>
            <div className="text-4xl font-bold text-primary mb-6">$19.99<span className="text-lg text-on-surface-variant">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="text-on-surface-variant">✓ Everything in Pro</li>
              <li className="text-on-surface-variant">✓ Team management</li>
              <li className="text-on-surface-variant">✓ Coach dashboard</li>
              <li className="text-on-surface-variant">✓ Custom branding</li>
            </ul>
            <button className="block w-full text-center px-6 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-medium hover:bg-secondary hover:text-on-secondary transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <a 
            href="/marketing"
            className="text-primary hover:text-primary-container font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}