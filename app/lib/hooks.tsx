import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  type ReactNode,
} from "react";

// Custom hook to track elapsed time from a start timestamp
export function useElapsedTime(startedAt: number) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.floor((Date.now() - startedAt) / 1000)
  );

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    };

    const interval = setInterval(updateElapsedTime, 1000);
    updateElapsedTime(); // Immediately update on mount

    return () => clearInterval(interval);
  }, [startedAt]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  return { elapsedSeconds, elapsedMinutes };
}

// Type definition for the RestTimeContext
type RestTimeContextType = {
  elapsedRestTime: number;
  formattedElapsedTime: string;
  startRest: () => void;
  stopRest: () => void;
};

// Default context value
const defaultRestTimeContext: RestTimeContextType = {
  elapsedRestTime: 0,
  formattedElapsedTime: "0:00",
  startRest: () => {
    throw new Error("startRest is not implemented");
  },
  stopRest: () => {
    throw new Error("stopRest is not implemented");
  },
};

// Create the RestTimeContext
export const RestTimeContext = createContext<RestTimeContextType>(
  defaultRestTimeContext
);

// Provider for the RestTimeContext
export function RestTimeProvider({ children }: { children: ReactNode }) {
  const [restStartTime, setRestStartTime] = useState<Date | null>(null);
  const [elapsedRestTime, setElapsedRestTime] = useState<number>(0);

  // Utility function to format elapsed time as hh:mm:ss or mm:ss
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  // Update elapsed time every second
  useEffect(() => {
    if (!restStartTime) return;

    const interval = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor(
        (Date.now() - restStartTime.getTime()) / 1000
      );
      setElapsedRestTime(elapsedTimeInSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [restStartTime]);

  const startRest = () => {
    setRestStartTime(new Date());
  };

  const stopRest = () => {
    setRestStartTime(null);
    setElapsedRestTime(0);
  };

  const formattedElapsedTime = formatElapsedTime(elapsedRestTime);

  return (
    <RestTimeContext.Provider
      value={{ elapsedRestTime, formattedElapsedTime, startRest, stopRest }}
    >
      {children}
    </RestTimeContext.Provider>
  );
}

// Hook to use the RestTimeContext
export function useRestTime() {
  const context = useContext(RestTimeContext);
  if (!context) {
    throw new Error("useRestTime must be used within a RestTimeProvider");
  }
  return context;
}
