"use client";
// hooks/useWakeLock.js
import { useEffect, useRef } from "react";

export default function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel>(null);

  useEffect(() => {
    let isSupported = "wakeLock" in navigator;

    const requestWakeLock = async () => {
      try {
        if (isSupported) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.error("Wake Lock request failed:", err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    requestWakeLock();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);
}
