import {Notification} from "./Notification";

export class EmailNotification implements Notification {
  send(message: string, type: string) {
    console.log(`Sending email with message: ${message}, type: ${type}`);
  }
}