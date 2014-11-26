/// <reference path="../multiplayer-lib/client-references.ts" />
/// <reference path="game-references.ts" />

class Client extends MultiplayerClient {
  constructor() {
    this.render = X.render;
    this.update = X.update;

    super();
  }

  // TODO - this should actually be a request on the server...
  getInitialGameState():GameState {
    return {
      unit1: [0, 0],
      unit2: [1, 0]
    };
  }
}

new Client();