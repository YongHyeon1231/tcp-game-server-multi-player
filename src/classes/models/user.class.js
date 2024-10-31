class User {
  constructor(socket, id, playerId, latency) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.x = 0;
    this.y = 0;
    this.lastUpdateTime = Date.now();
    this.latency = latency;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }
}

export default User;
