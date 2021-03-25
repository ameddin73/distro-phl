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
import firebase from "firebase";
import {COLLECTIONS} from "../../../util/config";
import {buildTypesObject, Converters} from "../../../util/utils";
import {ItemTypeInterface} from "util/types";
import {assertSucceeds} from "@firebase/rules-unit-testing";

const mockDefaultItem = ItemMocks.defaultItem;
let firebaseApp: firebase.app.App;
let db: firebase.firestore.Firestore;

beforeAll(async () => {
    const {firebaseApp: app} = await setupFirestore();
    firebaseApp = app;
    db = firebaseApp.firestore();
});
afterEach(cleanup);
afterAll(teardownFirestore);

it('should mount', async () => {
    const query = db.collection(COLLECTIONS.types).withConverter(Converters.itemTypeConverter);
    assertSucceeds(query.get());
    const querySnapshot = await query.get();
    const typeArray: ItemTypeInterface[] = [];
    querySnapshot.forEach((doc) => typeArray.push(doc.data()));
    const typeObject = buildTypesObject(typeArray);
    //
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