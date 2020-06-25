export default class EventEmitter {
  constructor() {
    this.handlers = {};
  }
  on(eventName, handler) {
    this.handlers[eventName] = this.handlers[eventName] || [];
    this.handlers[eventName].push(handler);
  }
  off(eventName, removeHandler) {
    if (this.handlers[eventName]) {
      this.handlers[eventName] = this.handlers[eventName].filter((handler) => {
        return removeHandler !== handler;
      });
      if (this.handlers[eventName].length === 0) {
        delete this.handlers[eventName];
      }
    }
  }
  fire(eventName, ...rest) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((handler) => {
        handler(...rest);
      });
    }
  }
}
