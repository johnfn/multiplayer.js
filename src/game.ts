/// <reference path="multiplayer.ts" />

var gameState:{[key: string]: any} = {
  unit1: [0, 0],
  unit2: [1, 0]
};

function transformGameState(state:{[key: string]: any}, input:Input) {
  state['unit1'][0]++;

  return state;
}

function renderGameState(state:{[key: string]: any}) {
  for (var k in state) {
    console.log(state[k]);
  }
}
