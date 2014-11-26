interface Input {
  buttonsDown:number[];
};

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

function gameLoop() {
  // TODO: need to do _.clone(gameState)
  gameState = transformGameState(gameState, { buttonsDown: [65] });

  renderGameState(gameState);
}

setInterval(gameLoop, 100);