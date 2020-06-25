export default class EventEmitter {
  constructor() {
    this._handlers = {};
  }
  on(eventName, handler) {
    this._handlers[eventName] = this._handlers[eventName] || [];
    this._handlers[eventName].push(handler);
  }
  off(eventName, removeHandler) {
    if (this._handlers[eventName]) {
      this._handlers[eventName] = this._handlers[eventName].filter((handler) => {
        return removeHandler !== handler;
      });
      if (this._handlers[eventName].length === 0) {
        delete this._handlers[eventName];
      }
    }
  }
  fire(eventName, ...rest) {
    if (this._handlers[eventName]) {
      this._handlers[eventName].forEach((handler) => {
        handler(...rest);
      });
    }
  }
}
