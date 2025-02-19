import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'app/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for listsple: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// (async () => {
//   const App = await import('app/App');
//   ReactDOM.render(<App.default />, document.getElementById('root'));
// })();
