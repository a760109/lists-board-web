import { Auth } from './auth';
import { Provider } from 'react-redux';
import store from './store';
import Login from 'app/main/login/Login';

function App() {
  return (
    <Provider store={store}>
      <Auth>
        <Login />
      </Auth>
    </Provider>
  );
}

export default App;
