"use client";

import { useEffect } from "react";

type Props = {
  entityType: "POST" | "DASHBOARD" | "OTHER";
  entityId: string;
};

export function PageViewTracker({ entityType, entityId }: Props) {
  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId }),
    }).catch(() => {
      // Silently ignore tracking errors
    });
  }, [entityType, entityId]);

  return null;
}
