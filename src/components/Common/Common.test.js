import React from 'react';
import ReactDOM from 'react-dom';
import Common from './Common';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Common />, div);
  ReactDOM.unmountComponentAtNode(div);
});