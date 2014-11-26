declare var io;

interface GameState{[key: string]: any};

interface Input {
  buttonsDown:number[];
};

class MultiplayerClient {
  gameState:GameState = {};
  socket:any;

  constructor() {
    this.socket = io();
    this.initializeGameState();

    this.socket.on('update', (data) => this.serverUpdate(data));

    setInterval(() => this.gameLoop(), 100);
  }

  serverUpdate(data:{[key: string]: any}) {
    this.gameState = data;
  }

  initializeGameState() {
    this.gameState = this.getInitialGameState();
  }

  getInitialGameState():GameState {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  render(state: GameState) {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  update(state: GameState, input:Input):GameState {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  gameLoop() {
    // TODO: need to do _.clone(gameState)
    this.gameState = this.update(this.gameState, { buttonsDown: [65] });

    this.render(this.gameState);
  }
}