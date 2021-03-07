import React from 'react';
import ReactDOM from 'react-dom';
import DistroItem from './DistroItem';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DistroItem />, div);
  ReactDOM.unmountComponentAtNode(div);
});