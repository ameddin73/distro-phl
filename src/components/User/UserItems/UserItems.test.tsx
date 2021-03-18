import React from 'react';
import ReactDOM from 'react-dom';
import UserItems from './UserItems';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserItems />, div);
  ReactDOM.unmountComponentAtNode(div);
});