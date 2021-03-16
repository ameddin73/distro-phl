import React from 'react';
import ReactDOM from 'react-dom';
import NothingHere from './NothingHere';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NothingHere />, div);
  ReactDOM.unmountComponentAtNode(div);
});