import Config from 'config';
import ListUtils from 'app/utils/ListUtils';

class ListWebSocket extends ListUtils.EventEmitter {
  connect = TOKEN => {
    this._token = TOKEN;

    if (this._ws) {
      this._ws.onclose = null;
      this._ws.close();
    }

    this._ws = new WebSocket(Config.wsURL, ['AUTH0-TOKEN', TOKEN]);
    this._ws.onopen = this.onOpen.bind(this);
    this._ws.onmessage = this.onMessage.bind(this);
    this._ws.onerror = this.onError.bind(this);
    this._ws.onclose = this.onClose.bind(this);

    this.pingInterval = setInterval(() => this.ping(), 30000);
  };

  onOpen = event => {
    console.log(new Date(), `WebSocket onOpen`, event);
  };

  onError = event => {
    console.error(`WebSocket onError`, event);
  };

  onClose = event => {
    console.log(new Date(), `WebSocket onClose code=${event.code}`, event);
    setTimeout(() => this.connect(this._token), 500);
  };

  onMessage = event => {
    let data = event.data;
    if (data.startsWith('{') && data.endsWith('}')) {
      data = JSON.parse(data);

      this.emit(data.event, data.data);
    }
  };

  ping = () => {
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      console.log(new Date(), 'ping');
      this._ws.send(JSON.stringify({ type: 'ping' }));
    }
  };
}

const instance = new ListWebSocket();

export default instance;
