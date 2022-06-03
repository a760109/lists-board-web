import { Auth } from './auth';
import { Provider } from 'react-redux';
import store from './store';
import Home from 'app/main/home/Home';
import Message from 'app/core/Message';
import { AlertProvider } from 'app/widgets/Alert';

function App() {
  return (
    <Provider store={store}>
      <Auth>
        <AlertProvider>
          <Home />
        </AlertProvider>
        <Message />
      </Auth>
    </Provider>
  );
}

export default App;
