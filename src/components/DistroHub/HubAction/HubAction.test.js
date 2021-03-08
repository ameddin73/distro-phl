import React from 'react';
import ReactDOM from 'react-dom';
import HubAction from './HubAction';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HubAction />, div);
  ReactDOM.unmountComponentAtNode(div);
});