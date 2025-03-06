interface Event<T> {
  payload: T;
}

type KeyEvent = Event<string>;

export class KeyloggerService {
  keys: string[] = [];

  constructor() {
    this.keys = [];
    console.log("KeyloggerService initialized");
  }

  keyPress(event: KeyEvent) {
    // console.log("keyPress", event);
    const { payload: key } = event;
    if (key === "⌫") {
      this.keys.pop();
    } else if (key === "␣") {
      this.keys.push(" ");
    } else {
      this.keys.push(key);
    }
    // console.log("keys", this.keys);
  }

  // keyRelease() {
  //     this.keys = []
  // }
}
