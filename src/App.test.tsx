import ReactDOM from 'react-dom';
import App from './App';
import {FIREBASE_CONFIG} from "util/config";

it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App config={FIREBASE_CONFIG}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
