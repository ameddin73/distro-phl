import React from 'react';
import ReactDOM from 'react-dom';
import DistroHub from './DistroHub';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DistroHub />, div);
  ReactDOM.unmountComponentAtNode(div);
});