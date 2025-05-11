"use client";
import useWakeLock from "@/hooks/useWakeLock";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useWakeLock();

  return <>{children}</>;
};
export default Layout;
