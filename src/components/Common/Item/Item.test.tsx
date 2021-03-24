import React from 'react';
import Item from './Item';
import * as useItemTypes from "util/hooks/useItemTypes";
import {cleanup, render} from "@testing-library/react";
import {FirebaseAppProvider} from "reactfire";
import {teardownFirestore} from "test/firestore/firestoreEmulator";
import {ItemMocks} from "test/mocks/item.mock";
import {initializeAdminApp, initializeTestApp} from '@firebase/testing';
import setTypes from "test/firestore/setTypes";

const mockDefaultItem = ItemMocks.defaultItem;
// @ts-ignore
// let firebaseApp: firebase.app.App;

const PROJECT_ID = `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`;

beforeAll(async () => {
    // [firebaseApp] = await setupFirestore()
});

afterEach(cleanup);

afterAll(teardownFirestore);

it('should print types', async () => {
    const firebaseApp = initializeTestApp({projectId: PROJECT_ID});
    const firestoreAdmin = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    await setTypes(firestoreAdmin);

    const typeRef = firebaseApp.firestore().collection('item_types');
    const data = await typeRef.doc('perishable').get();
    // console.dir(data)
});

it('should mount', () => {
    const renderer = render(
        <FirebaseAppProvider firebaseApp={firebaseApp}>
            <Item item={mockDefaultItem}/>
        </FirebaseAppProvider>);

    expect(renderer.baseElement).toBe('div');
});

it('renders correctly', () => {
    // @ts-ignore
    useItemTypes.default.mockReturnValue(mockDefaultTypes);
    // const wrapper = shallow(<Item item={mockDefaultItem}/>);
    // expect(wrapper).toMatchSnapshot();
});