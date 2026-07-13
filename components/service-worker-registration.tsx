"use client";

import { useEffect } from "react";
import { sitePath } from "@/lib/site-url";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(sitePath("/sw.js")).catch(() => {
        // PWA support should never block the lead flow.
      });
    }
  }, []);

  return null;
}
