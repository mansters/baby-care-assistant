"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const useParamsMessage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const toastType = searchParams.get("toast");
    const toastMessage = searchParams.get("toastMessage");

    if (toastType && toastMessage) {
      setToast({
        open: true,
        message: toastMessage,
        severity: toastType as "success" | "error",
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete("toast");
      params.delete("toastMessage");
      const remaining = params.toString();
      router.replace(remaining ? `${pathname}?${remaining}` : pathname, {
        scroll: false,
      });
    }
  }, [searchParams, router, pathname]);

  const onClose = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={toast.severity} sx={{ width: "100%" }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default useParamsMessage;
