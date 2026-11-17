import React from 'react';
import ReactDOM from 'react-dom/client';



import App from './App';
import {Provider} from 'react-redux';//to make redux store availble to whole app
import store from './store'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store ={store}>
    <App />
    </Provider>
  //</React.StrictMode>
);


