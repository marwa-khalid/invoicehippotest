// src/utils/statusUtils.ts

// Function to get the CSS class for a given status value
export const getStatusClass = (statusValue: number): string => {
  switch (statusValue) {
    case 1:
      return "bg-secondary text-dark"; // Concept
    case 2:
      return "bg-info"; // Waiting for approval
    case 4:
      return "bg-success"; // Accepted by client
    case 8:
      return "bg-warning"; // Rejected by client
    case 16:
      return "bg-warning"; // Overdue/1st reminder
    case 32:
    case 64:
      return "bg-danger"; // Overdue/Last reminder
    case 128:
      return "bg-dark text-white"; // Cancelled
    case 256:
      return "bg-warning"; // Paused
    case 512:
      return "bg-primary"; // Planning
    case 1024:
      return "bg-info"; // Realization
    case 2048:
      return "bg-success"; // Completed
    default:
      return "bg-default"; // Default
  }
};
