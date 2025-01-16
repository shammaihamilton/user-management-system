import { toast } from "react-toastify";

export const notifyError = (message: string) => {
    toast.error(`${message}`, {
      position: "top-center",
      autoClose: 2000,
    });
  };

export const notifySuccess = (message: string) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 1000,
  });
};
