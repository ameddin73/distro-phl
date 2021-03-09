import React from 'react';
import ReactDOM from 'react-dom';
import AddItem from './AddItem';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});