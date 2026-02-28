import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

export const useAppToast = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
      icon: React.createElement(CheckCircle2, { className: "h-5 w-5 text-green-500" }),
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description: description || "Try again",
      duration: 6000,
      icon: React.createElement(AlertCircle, { className: "h-5 w-5 text-red-500" }),
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
      icon: React.createElement(Info, { className: "h-5 w-5 text-blue-500" }),
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
      icon: React.createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-500" }),
    });
  };

  return { showSuccess, showError, showInfo, showWarning };
};
