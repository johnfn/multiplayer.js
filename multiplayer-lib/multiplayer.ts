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

interface Connection {
  socket:any;
  id:number;
  storedData:{[key: string]: string};
}

class MultiplayerServer {
  gameState:GameState = {};
  update: (state:GameState, input:Input) => GameState;

  io:any;
  connections: Connection[] = [];

  smallestUnusedID:number = 0;

  constructor(io:any, update:(state:GameState, input:Input) => GameState) {
    var self:MultiplayerServer = this;

    this.io = io;
    this.update = update;

    setInterval(() => this.gameLoop(), 100);

    io.on('connection', function(socket) {
      var connection:Connection = {
        socket: socket,
        id: self.getUniqueID(),
        storedData: {}
      };

      self.connections.push(connection);

      socket.on('update-response', function(response) {
        connection.storedData = response;
      });

      socket.on('disconnect', function() {
        var index;

        // find index of connection in list (can't store; it could have changed)

        for (var i = 0; i < self.connections.length; i++) {
          if (self.connections[i].id === connection.id) {
            index = i;
            break;
          }
        }

        self.connections.splice(i, 1);
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
      this.connections[i].socket.emit('update');
    }

    for (var i = 0; i < this.connections.length; i++) {
      console.log('from socket ' + this.connections[i].id + ' got:: ' + this.connections[i].storedData);

      this.connections[i].storedData = undefined;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports.MultiplayerServer = MultiplayerServer;
}