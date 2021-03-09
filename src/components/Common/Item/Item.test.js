import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Item';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Item />, div);
  ReactDOM.unmountComponentAtNode(div);
});