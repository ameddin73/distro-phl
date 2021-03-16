import React from 'react';
import ReactDOM from 'react-dom';
// import ItemList from './ItemList'; TODO testing

it('It should mount', () => {
  const div = document.createElement('div');
    // ReactDOM.render(<ItemList  path={}/>, div); TODO testing
  ReactDOM.unmountComponentAtNode(div);
});