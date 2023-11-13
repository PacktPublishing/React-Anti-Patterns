import { Notification } from "./Notification";
import { EmailNotification } from "./EmailNotification";

class Application {
  private notifier: Notification;

  constructor(notifier: Notification) {
    this.notifier = notifier;
  }

  process() {
    // perform some actions to response user interaction
    this.notifier.send("Some event happened", "info");
  }
}

const app = new Application(new EmailNotification());
app.process();



export default Application;
