export interface Notification {
  send(message: string, type: string): void;
}