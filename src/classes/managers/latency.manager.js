class LatencyManager {
  constructor() {
    this.intervals = new Map();
  }

  addUser(userId, callback, interval) {
    if (this.intervals.has(userId)) {
      console.error('중복된 인터벌 감지');
    }
    this.intervals.set(userId, setInterval(callback, interval));
  }

  removeUser(userId) {
    if (this.intervals.has(userId)) {
      const userIntervals = this.intervals.get(userId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(userId);
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default LatencyManager;
