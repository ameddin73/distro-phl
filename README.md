# DISTRO PHL

A platform for P2P resource distrobution. Everything for everyone, no questions asked.

## Running Locally

### Install Packages

#### `npm i`

#### `npm i -g firebase-tools`

### Setup Firebase

#### `firebase login`

Connect to dev project.

*Request permission from repo owner for project access.*

### Run

*Local environment variables from the firebase project are needed to run. Request from owner.*

#### `npm start`

This will start the app and connect to the firebase dev project. Run firestore & auth emulators to run locally.

### Test

**Test firestore rules:**

#### `firebase --project test-project emulators:start --only firestore`

#### `npm test -- --watchAll-false --testPathPattern="irestore.test.ts --forceExit`

**Test React app:**

#### `firebase --project test-project emulators:start --only firestore --import src/test/firestore`

#### `npm test -- --testPathIgnorePatterns="firestore.test.ts"`

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

##### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

##### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `npm run eject`

**🔴 Don't do this.**
