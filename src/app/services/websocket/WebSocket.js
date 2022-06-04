import Config from 'config';

class WebSocket {
  connect = () => {
    if (this._ws) {
      this._ws.onclose = null;
      this._ws.close();
    }

    this._ws = new WebSocket(Config.wsURL);
  };

  onOpen = event => {
    console.log(`WebSocket onOpen`, event);
  };

  onError = event => {
    console.error(`WebSocket onError`, event);
  };

  onClose = event => {
    console.log(`WebSocket onClose code=${event.code}`, event);
    setTimeout(() => this.connect(), 15000);
  };

  onMessage = event => {
    console.log(`WebSocket onMessage`, event);
  };

  ping = () => {
    this._ws.send(JSON.stringify({ type: 'ping' }));
  };
}

const instance = new WebSocket();

export default instance;
