/// <reference types="vite/client" />

export {}; // Ensure this is a module

declare global {
  interface Window {
    Intercom?: (command: string, options?: any) => void;
    intercomSettings?: {
      app_id: string;
      [key: string]: any;
    };
  }
}
