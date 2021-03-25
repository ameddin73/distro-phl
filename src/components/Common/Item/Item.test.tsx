/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import Item from './Item';
import useItemTypes from "util/hooks/useItemTypes";
import {cleanup, render} from "@testing-library/react";
import {FirebaseAppProvider} from "reactfire";
import {setupFirestore, teardownFirestore} from "test/firestore/firestoreEmulator";
import {ItemMocks} from "test/mocks/item.mock";

const mockDefaultItem = ItemMocks.defaultItem;
// @ts-ignore
let firebaseApp: firebase.app.App;

beforeAll(async () => {
    [firebaseApp] = await setupFirestore()
});
afterEach(cleanup);
afterAll(teardownFirestore);

it('should mount', async () => {
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