import { toast } from "@/app/components/Toast";

const sendNotification = (activeType: "focus" | "break" | "long_break", text?: string) => {
  if (document.visibilityState === "visible") {
    toast("Time's up!", "blue");
    return;
  } else {
    if (Notification.permission === "granted") {
      new Notification("Time's up!", {
        body: text ? text : activeType === "focus" ? "Take a break!" : "Back to work!",
        icon: "/notification-icon.png",
      });
    } else {
      toast("Please allow notification in your browser settings.", "blue");
    }
  }
};

export default sendNotification;
