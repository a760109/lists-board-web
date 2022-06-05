import { Auth } from './auth';
import { Provider } from 'react-redux';
import store from './store';
import Home from 'app/main/home/Home';
import Message from 'app/core/Message';
import { AlertProvider } from 'app/widgets/Alert';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function App() {
  return (
    <Provider store={store}>
      <Auth>
        <AlertProvider>
          <DndProvider backend={HTML5Backend}>
            <Home />
          </DndProvider>
        </AlertProvider>
        <Message />
      </Auth>
    </Provider>
  );
}

export default App;
