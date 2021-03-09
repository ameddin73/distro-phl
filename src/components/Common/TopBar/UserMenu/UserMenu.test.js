import React from 'react';
import ReactDOM from 'react-dom';
import UserMenu from './UserMenu';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});