import React from 'react';
import ReactDOM from 'react-dom';
// import Item from './Item'; TODO testing

it('It should mount', () => {
  const div = document.createElement('div');
    // ReactDOM.render(<Item />, div); TODO testing
  ReactDOM.unmountComponentAtNode(div);
});