export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      this.events[event] = [];
    }

    return this.events[event].push(callback);
  }

  publish(event, data) {
    const pubData = data || {};

    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      return [];
    }

    return this.events[event].map(callback => callback(pubData));
  }
}
