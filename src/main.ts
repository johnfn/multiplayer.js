/// <reference path="../multiplayer-lib/client-references.ts" />
/// <reference path="game-references.ts" />

class Client extends MultiplayerClient {
  render:any = renderGameState;
  update:any = transformGameState;
}

new Client();