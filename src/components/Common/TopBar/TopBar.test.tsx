import React from 'react';
import ReactDOM from 'react-dom';
import TopBar from "./TopBar";

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TopBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});