import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ListContainer from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ListContainer />, document.getElementById('root'));
registerServiceWorker();