declare var io;
declare var module;

interface GameState{[key: string]: any};

interface Input {
  buttonsDown:number[];
  eventNames:string[];
};

class MultiplayerClient {
  gameState:GameState = {};
  socket:any;
  inputEvents:Input = {buttonsDown: [], eventNames: []};

  render:(state:GameState) => void
  update:(state:GameState, input:Input) => GameState;

  constructor() {
    if (!this.render) this.render = (state:GameState) => console.error("no render function!"); //TODO: how come can't throw???
    if (!this.update) this.update = (state:GameState, input:Input) => { console.error("no render function!"); return undefined; }

    this.socket = io();
    this.initializeGameState();

    this.socket.on('update', (data) => this.sendUpdateToServer());
  }

  // The server is demanding an update from us
  sendUpdateToServer() {
    this.socket.emit('update-response', JSON.stringify(this.inputEvents));

    // clear out events
    this.inputEvents.buttonsDown = [];
    this.inputEvents.eventNames = [];
  }

  trigger(name:string) {
    this.inputEvents.eventNames.push(name);
  }

  initializeGameState() {
    this.gameState = this.getInitialGameState();
  }

  getInitialGameState():GameState {
    throw new Error("needs to be overriden in subclass");

    return undefined;
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
    this.io = io;
    this.update = update;

    setInterval(() => this.gameLoop(), 100);

    io.on('connection', (socket) => {
      var connection:Connection = { socket: socket, id: this.getUniqueID(), storedData: {} };

      this.addConnection(connection);

      console.log('a user connected');
    });
  }

  addConnection(connection:Connection) {
    this.connections.push(connection);

    connection.socket.on('update-response', (response) => {
      console.log(response);
      connection.storedData = JSON.parse(response);
    });

    connection.socket.on('disconnect', () => {
      var index;

      // find index of connection in list (can't store; it could have changed)

      for (var i = 0; i < this.connections.length; i++) {
        if (this.connections[i].id === connection.id) {
          index = i;
          break;
        }
      }

      this.connections.splice(i, 1);
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
      var data = (this.connections[i].storedData);

      console.log('from socket ' + this.connections[i].id + ' got:: ' + data);

      this.connections[i].storedData = undefined;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports.MultiplayerServer = MultiplayerServer;
}