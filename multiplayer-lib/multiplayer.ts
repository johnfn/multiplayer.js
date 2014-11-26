declare var io;
declare var module;

interface GameState{[key: string]: any};

interface Input {
  buttonsDown:number[];
};

class MultiplayerClient {
  gameState:GameState = {};
  socket:any;

  render:(state:GameState) => void = (state:GameState) => console.error("no render function!"); //TODO: how come can't throw???
  update:(state:GameState, input:Input) => GameState = (state:GameState, input:Input) => { console.error("no render function!"); return undefined; }

  constructor() {
    this.socket = io();
    this.initializeGameState();

    this.socket.on('update', (data) => this.serverUpdate(data));

    setInterval(() => this.gameLoop(), 100);
  }

  serverUpdate(data:{[key: string]: any}) {
    // this.gameState = data;
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
  io:any;

  constructor(io:any) {
    this.io = io;

    io.on('connection', function(socket) {
      console.log('a user connected');

      io.emit('update', {
        for: 'everyone',
        data: 'nothing new'
      });

      socket.on('message', function(msg) {
        console.log("message received:", msg);
      });
    });
  }
}

if (typeof module !== 'undefined') {
  module.exports.MultiplayerServer = MultiplayerServer;
}