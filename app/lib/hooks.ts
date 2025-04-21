import { useEffect, useState } from "react";

export function useElapsedTime(startedAt: number) {
  const [elapsedSeconds, setElapsedSeconds] = useState(
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor(
        (Date.now() - new Date(startedAt).getTime()) / 1000
      );
      setElapsedSeconds(elapsedTimeInSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  return { elapsedSeconds, elapsedMinutes };
}
