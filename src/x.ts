/// <reference path="../multiplayer-lib/client-references.ts" />
/// <reference path="game-references.ts" />

interface MultiplayerBasics {
  render(state:GameState);
  update(state:GameState, input:Input):GameState;
};

var X:MultiplayerBasics = {
  render(state:GameState) {
    for (var k in state) {
      console.log(state[k]);
    }
  },

  update(state:GameState, input:Input):GameState {
    this.on(input, 'clickbutton1', function() {
      state['unit1'][0]++;
    });

    return state;
  }
};

if (typeof module !== 'undefined') {
  module.exports.X = X;
}