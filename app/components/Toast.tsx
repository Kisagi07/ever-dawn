"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface Toast {
  id: string;
  message: string;
  classNames?: string;
}

interface ToastContext {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContext | null>(null);

interface ToastProvider {
  children: ReactNode;
}

let addToastFunction:
  | ((message: string, color?: "red" | "blue") => void)
  | null = null;

export function ToastProvider({ children }: ToastProvider) {
  const [toast, setToast] = useState<Toast[]>([]);

  const addToast = (message: string, color?: "red" | "blue") => {
    let classNames = "";

    switch (color) {
      case "red":
        classNames = "bg-red-200 text-red-600 ring-red-300";
        break;
      case "blue":
        classNames = "bg-blue-200 text-blue-600 ring-blue-300";
        break;
      default:
        classNames = "bg-neutral-200 text-neutral-600 ring-neutral-300";
    }

    const id = Math.random().toString(36).substring(2, 9);
    setToast((prev) => [...prev, { id, message, classNames }]);

    setTimeout(() => {
      setToast((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  addToastFunction = addToast;

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toast.map((toast, index) => (
        <div
          key={toast.id}
          style={{ bottom: `${10 + index * 5}px` }}
          className={`ring fixed right-5 transition-[bottom] shadow-floating  p-4 rounded-lg max-w-80 w-full flex items-center gap-4 animate-wiggle ${toast.classNames}`}
        >
          <InformationCircleIcon className="h-6 w-6" />
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </ToastContext.Provider>
  );
}

export function toast(message: string, color?: "red" | "blue") {
  if (addToastFunction) {
    addToastFunction(message, color);
  } else {
    console.error(
      "ToastProvider is not mounted. Wrap your app with <ToastProvider />."
    );
  }
}
