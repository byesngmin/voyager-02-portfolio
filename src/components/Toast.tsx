import { useEffect, useRef, useState } from "react";

type Toast = {
  id: string;
  message: string;
};

type ToastItemProps = {
  message: string;
  onDismiss: () => void;
};

type ToastContainerProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

export function ToastItem({ message }: ToastItemProps) {
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  return (
    <div
      className="toast-container"
      aria-live="polite"
      role="region"
      aria-label="알림"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

function createToastId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutIdsRef = useRef<Map<string, number>>(new Map());

  const removeToast = (id: string) => {
    const timeoutId = timeoutIdsRef.current.get(id);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  };

  const addToast = (message: string) => {
    const id = createToastId();

    setToasts((currentToasts) => [...currentToasts, { id, message }]);

    const timeoutId = window.setTimeout(() => {
      removeToast(id);
    }, 3000);

    timeoutIdsRef.current.set(id, timeoutId);
  };

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current.clear();
    };
  }, []);

  return { toasts, addToast, removeToast };
}
