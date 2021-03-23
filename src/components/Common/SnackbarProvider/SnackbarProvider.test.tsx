import React from 'react';
import ReactDOM from 'react-dom';
import SnackbarProvider from './SnackbarProvider';

it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SnackbarProvider/>, div);
    ReactDOM.unmountComponentAtNode(div);
});