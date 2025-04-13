
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  [key: string]: any;
};

const useToast = () => {
  return {
    toast: (props: ToastProps) => {
      const { title, description, action, ...rest } = props;
      return sonnerToast(title as string, {
        description,
        action,
        ...rest,
      });
    },
    dismiss: (toastId?: string) => {
      sonnerToast.dismiss(toastId);
    },
  };
};

const toast = (props: ToastProps) => {
  const { title, description, action, ...rest } = props;
  return sonnerToast(title as string, {
    description,
    action,
    ...rest,
  });
};

export { useToast, toast };
