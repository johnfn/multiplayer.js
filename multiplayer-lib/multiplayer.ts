declare var io;
declare var module;

interface GameState{[key: string]: any};

interface Input {
  buttonsDown:number[];
};

class MultiplayerClient {
  gameState:GameState = {};
  socket:any;

  render:(state:GameState) => void
  update:(state:GameState, input:Input) => GameState;

  constructor() {
    if (!this.render) this.render = (state:GameState) => console.error("no render function!"); //TODO: how come can't throw???
    if (!this.update) this.update = (state:GameState, input:Input) => { console.error("no render function!"); return undefined; }

    this.socket = io();
    this.initializeGameState();

    this.socket.on('update', (data) => this.sendUpdateToServer());

    // setInterval(() => this.gameLoop(), 100);
  }

  // The server is demanding an update from us
  sendUpdateToServer() {
    this.socket.emit('update-response', 'wheeeee');
  }

  initializeGameState() {
    this.gameState = this.getInitialGameState();
  }

  getInitialGameState():GameState {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  gameLoop() {
    // TODO: need to do _.clone(gameState)
    this.gameState = this.update(this.gameState, { buttonsDown: [65] });

    this.render(this.gameState);
  }
}

class MultiplayerServer {
  gameState:GameState = {};
  update: (state:GameState, input:Input) => GameState;

  io:any;
  connections: any[] = [];
  storedData: {[key: string]: string} = {};

  smallestUnusedID:number = 0;

  constructor(io:any, update:(state:GameState, input:Input) => GameState) {
    var self:MultiplayerServer = this;

    this.io = io;
    this.update = update;

    setInterval(() => this.gameLoop(), 100);

    io.on('connection', function(socket) {
      var id:number = self.getUniqueID();

      self.connections.push(socket);

      socket.on('update-response', function(response) {
        self.storedData[id] = response;
      });

      console.log('a user connected');
    });
  }

  getUniqueID():number {
    return this.smallestUnusedID++;
  }

  getHighestID():number {
    return this.smallestUnusedID - 1;
  }

  gameLoop() {
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].emit('update');
    }

    for (var i = 0; i <= this.getHighestID(); i++) {
      console.log("from id: " + i + " got: " + this.storedData[i]);
      this.storedData[i] = undefined;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports.MultiplayerServer = MultiplayerServer;
}