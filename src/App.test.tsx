import {screen} from '@testing-library/react';
// import App from './App';

test('renders learn react link', () => {
    // render(<App />); TODO test
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
