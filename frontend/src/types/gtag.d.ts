// Centralized Google Analytics gtag typings (global augmentation)
export {};

declare global {
  interface Window {
    gtag?: (command: 'config' | 'set' | 'event', targetId?: string, params?: Record<string, any>) => void;
  }
}
