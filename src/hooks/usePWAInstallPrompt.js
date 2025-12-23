
import { useEffect, useState } from "react";

export const usePWAInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
   const handler = (e) => {
   
    e.preventDefault();
    setInstallPromptEvent(e);
    setIsInstallable(true);
  };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setInstallPromptEvent(null);
    setIsInstallable(false);
  };

  return { isInstallable, promptInstall };
};
