"use client";

import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function ToastProvider() {
  const [toastMessage, setToastMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      setToastMessage(event.detail.message);
      setIsVisible(true);
    };

    window.addEventListener("show-toast", handleShowToast as EventListener);

    return () => {
      window.removeEventListener("show-toast", handleShowToast as EventListener);
    };
  }, []);

  return (
    <Toast
      message={toastMessage}
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
    />
  );
}
