/// <reference path="../multiplayer-lib/client-references.ts" />
/// <reference path="game-references.ts" />

class Client extends MultiplayerClient {
  // TODO - this should actually be a request on the server...
  getInitialGameState():{[key: string]: any} {
    return {
      unit1: [0, 0],
      unit2: [1, 0]
    };
  }

  update(state:{[key: string]: any}, input:Input) {
    state['unit1'][0]++;

    return state;
  }

  render(state:{[key: string]: any}) {
    for (var k in state) {
      console.log(state[k]);
    }
  }
}

new Client();