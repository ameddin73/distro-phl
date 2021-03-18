import React from 'react';
import ReactDOM from 'react-dom';
// import UserAction from './UserAction';

it('It should mount', () => {
  const div = document.createElement('div');
    // ReactDOM.render(<UserAction />, div); TODO testing
  ReactDOM.unmountComponentAtNode(div);
});