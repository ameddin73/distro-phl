import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import {FIREBASE_CONFIG} from "./util/config";

// Use your config values here.
firebase.initializeApp(FIREBASE_CONFIG);

ReactDOM.render(
    <div>
        <App config={FIREBASE_CONFIG}/>
    </div>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();