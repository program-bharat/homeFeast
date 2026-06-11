import { toast } from "react-toastify";

export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  warning: (message) => toast.warning(message),
  info: (message) => toast.info(message),
  loading: (message) => toast.loading(message),
  dismiss: (id) => toast.dismiss(id),
  promise: (promise, messages) =>
    toast.promise(promise, {
      pending: messages.loading,
      success: messages.success,
      error: messages.error,
    }),
};