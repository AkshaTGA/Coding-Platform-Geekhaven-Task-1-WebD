import { toast, Bounce } from "react-toastify";

const toastIdFor = (message, type) => `${type || "info"}-${message}`;

export const notify = (
  message,
  type,
  time = 5000,
  position = "bottom-right",
  hideprogress = false
) => {
  const id = toastIdFor(message, type);

  const t = type == "sucess" ? "success" : type;

  const opts = {
    position,
    autoClose: time,
    hideProgressBar: hideprogress,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
    toastId: id,
  };

  if (t === "warn") toast.warn(message, opts);
  else if (t === "error") toast.error(message, opts);
  else if (t === "success") toast.success(message, opts);
  else toast.info(message, opts);
};
