
import * as React from "react";
import { toast as sonnerToast, type Toast } from "sonner";

type ToastProps = Toast & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
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
