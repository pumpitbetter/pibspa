import { Link } from "react-router";
import { dbPromise } from "~/db/db";
import { useEffect, useState } from "react";

export async function clientLoader() {
  // Initialize database without redirect
  if (typeof window !== 'undefined') {
    try {
      const db = await dbPromise;
      if (!db) {
        console.warn("Database initialization failed, app may not work properly");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  
  return null;
}

export default function AppHome() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = await dbPromise;
        if (db) {
          setDatabaseReady(true);
        }
      } catch (error) {
        console.error("Database initialization error:", error);
      }
    };
    initializeDatabase();
  }, []);

  if (!databaseReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-on-surface mb-2">
            Welcome to Pump It Better
          </h1>
          <p className="text-lg text-on-surface-variant">
            Your fitness journey starts here
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Start Workout */}
          <Link 
            to="/app/queue"
            className="bg-primary text-on-primary rounded-xl p-6 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-on-primary/10 flex items-center justify-center group-hover:bg-on-primary-container/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Today's Workout</h3>
            <p className="opacity-90">Jump into your scheduled workout for today</p>
          </Link>

          {/* Choose Program */}
          <Link 
            to="/app/program"
            className="bg-secondary-container text-on-secondary-container rounded-xl p-6 hover:bg-secondary transition-colors shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-on-secondary-container/10 flex items-center justify-center group-hover:bg-on-secondary-container/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Training Programs</h3>
            <p className="opacity-90">Browse and select from proven workout programs</p>
          </Link>

          {/* Progress & Analytics */}
          <Link 
            to="/app/progress"
            className="bg-tertiary-container text-on-tertiary-container rounded-xl p-6 hover:bg-tertiary hover:text-on-tertiary transition-colors shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-on-tertiary-container/10 flex items-center justify-center group-hover:bg-on-tertiary/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
            <p className="opacity-90">Track your strength gains and workout history</p>
          </Link>

          {/* Workout History */}
          <Link 
            to="/app/history"
            className="bg-surface-container text-on-surface rounded-xl p-6 hover:shadow-xl transition-shadow border border-outline-variant group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Workout History</h3>
            <p className="text-on-surface-variant">Review your past workouts and performance</p>
          </Link>

          {/* Settings */}
          <Link 
            to="/app/settings"
            className="bg-surface-container text-on-surface rounded-xl p-6 hover:shadow-xl transition-shadow border border-outline-variant group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="text-on-surface-variant">Customize your app preferences and units</p>
          </Link>

          {/* Quick Start */}
          <div className="bg-outline-variant/20 rounded-xl p-6 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">New Here?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Start with a proven program like 5x5 or 5/3/1
            </p>
            <Link 
              to="/app/program"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              Choose Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}