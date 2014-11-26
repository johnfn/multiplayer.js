interface Input {
  buttonsDown:number[];
};

class MultiplayerClient {
  constructor() {
    setInterval(() => this.gameLoop(), 100);
  }

  gameLoop() {
    // TODO: need to do _.clone(gameState)
    gameState = transformGameState(gameState, { buttonsDown: [65] });

    renderGameState(gameState);
  }
}