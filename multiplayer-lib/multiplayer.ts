interface Input {
  buttonsDown:number[];
};

// TODO need to typedef gamestate

class MultiplayerClient {
  gameState:{[key: string]: any} = {};
  initialGameState:{[key: string]: any} = {};

  constructor() {
    this.initializeGameState();

    setInterval(() => this.gameLoop(), 100);
  }

  initializeGameState() {
    this.gameState = this.getInitialGameState();
  }

  getInitialGameState():{[key: string]: any} {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  render(state: {[key: string]: any}) {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  update(state: {[key: string]: any}, input:Input):{[key: string]: any} {
    throw new Error("needs to be overriden in subclass");

    return undefined;
  }

  gameLoop() {
    // TODO: need to do _.clone(gameState)
    this.gameState = this.update(this.gameState, { buttonsDown: [65] });

    this.render(this.gameState);
  }
}