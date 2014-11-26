/// <reference path="../multiplayer-lib/client-references.ts" />
/// <reference path="game-references.ts" />

class Client extends MultiplayerClient {
  // TODO - this should actually be a request on the server...
  getInitialGameState():GameState {
    return {
      unit1: [0, 0],
      unit2: [1, 0]
    };
  }

  // TODO should be props, not fns
  render(state:GameState) {
    return X.render(state)
  }

  update(state:GameState, input:Input) {
    return X.update(state, input);
  }
}

new Client();