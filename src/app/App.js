import { Auth } from './auth';
import { Provider } from 'react-redux';
import store from './store';
import Home from 'app/main/home/Home';

function App() {
  return (
    <Provider store={store}>
      <Auth>
        <Home />
      </Auth>
    </Provider>
  );
}

export default App;
