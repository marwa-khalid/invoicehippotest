import { toast, ToastOptions, Id } from "react-toastify";
import { TraceInfoType } from "./_models";

// Utility function to handle errors
export function handleToast(response: any) {
  if (response && response.messages && response.messages.length > 0) {
    response.messages.forEach((msg: any) => {
      const message = msg.message;
      const messageType = msg.type;

      // Get toast options based on message type
      const { type, color } = getToastOptions(messageType);

      // Dynamically call the correct toast function
      const toastFunction = toast[type as keyof typeof toast] as (
        message: string,
        options?: ToastOptions
      ) => Id;

      // Display the toast for each message
      toastFunction(message);
    });
  } else if (response instanceof Error) {
    const message = response.message;
    toast.error(message);
  }

  // If there are errors in the response, throw an error
  if (response.hasErrors) {
    throw new Error(response.messages[0]?.message || "An error occurred");
  } else {
    return;
  }
}

// Define toast options based on message type
function getToastOptions(messageType: number): { type: string; color: string } {
  switch (messageType) {
    case TraceInfoType.Debug:
      return { type: "info", color: "grey" };
    case TraceInfoType.Success:
      return { type: "success", color: "green" };
    case TraceInfoType.Information:
      return { type: "info", color: "blue" };
    case TraceInfoType.Warning:
      return { type: "warning", color: "orange" };
    case TraceInfoType.Error:
      return { type: "error", color: "red" };
    case TraceInfoType.Critical:
    case TraceInfoType.Fatal:
    case TraceInfoType.UpgradeError:
      return { type: "error", color: "red" };
    case TraceInfoType.Upgrade:
      return { type: "info", color: "blue" };
    default:
      return { type: "error", color: "black" };
  }
}
