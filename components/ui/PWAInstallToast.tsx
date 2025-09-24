import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export const PWAInstallToast = () => {
  const { isInstallable, handleInstallClick } = usePWAInstall();
  const { toast } = useToast();

  const showInstallToast = useCallback(() => {
    if (!isInstallable) return;

    toast({
      title: "Install MovieFlix",
      description:
        "Install our app for a better experience with offline support and quick access.",
      action: (
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            handleInstallClick();
          }}
        >
          Install
        </Button>
      ),
      duration: 10000, // Show for 10 seconds
    });
  }, [isInstallable, handleInstallClick, toast]);

  // Show the toast when the component mounts and isInstallable is true
  useCallback(() => {
    if (isInstallable) {
      showInstallToast();
    }
  }, [isInstallable, showInstallToast]);

  return null; // This is a utility component that doesn't render anything
};
