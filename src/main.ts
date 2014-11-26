/// <reference path="client-references.ts" />

class Client extends MultiplayerClient {
  render:any = renderGameState;
  update:any = transformGameState;
}

new Client();