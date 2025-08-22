import { useState, useEffect } from "react";
import type { RxDocument } from "rxdb";
import type { HistoryDocMethods, HistoryDocType } from "~/db/history";

export function useActiveItem(
  sets: Record<string, RxDocument<HistoryDocType, HistoryDocMethods>[]>,
  initialActiveItemId: string | null = null
) {
  const items = Object.values(sets).flat();

  // Retrieve the initial value from localStorage or use the provided initial value
  const getInitialActiveItemId = () => {
    const storedId = localStorage.getItem("activeItemId");
    return storedId || initialActiveItemId;
  };

  const [hActiveItemId, hSetActiveItemId] = useState<string | null>(
    getInitialActiveItemId()
  );

  // Update localStorage whenever hActiveItemId changes
  useEffect(() => {
    if (hActiveItemId) {
      localStorage.setItem("activeItemId", hActiveItemId);
    } else {
      localStorage.removeItem("activeItemId");
    }
  }, [hActiveItemId]);

  return {
    activeItemId: hActiveItemId,
    setActiveItemId: (value: string | null) => {
      hSetActiveItemId(value);
    },
    setNextActiveItemId: (after: string) => {
      const currentIndex = items.findIndex((item) => item.id === after);
      const nextIndex = (currentIndex + 1) % items.length;
      hSetActiveItemId(items[nextIndex].id);
    },
  };
}
