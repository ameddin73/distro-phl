import React from 'react';
import ReactDOM from 'react-dom';
import ItemList from './ItemList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ItemList />, div);
  ReactDOM.unmountComponentAtNode(div);
});