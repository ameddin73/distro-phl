/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import ItemList from "./ItemList";
import {customRender, rendersNothingHere, resetFirebase, setupFirebase} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import {COLLECTIONS} from "util/config";
import {Query} from "util/utils";
import {FirestoreQueryWhere, ItemInterface} from "util/types";
import {UserMocks} from "test/mocks/user.mock";

const path = COLLECTIONS.items;
const orderBy = Query.orderByCreated;
const query = {
    where: [Query.whereActive, Query.whereNoExpiration],
    orderBy,
}
const props = {path, query};

beforeAll(setupFirebase);
afterEach(async () => await resetFirebase());

it('should mount', async () => {
    customRender(<ItemList {...props}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
});

it('renders all items', async () => {
    customRender(<ItemList {...props}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    const items = screen.getAllByText('Supplied by:');
    expect(items.length).toBeGreaterThanOrEqual(3);
});

it('filters items', async () => {
    const filter = ((item: ItemInterface) => item.uid !== UserMocks.defaultUser.uid);
    customRender(<ItemList {...props} filter={filter}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    const items = screen.getAllByText('Supplied by:');
    expect(items.length).toBe(1);
});

it('renders NothingHere if query returns empty list', async () => {
    const newWhere: FirestoreQueryWhere = {
        fieldPath: 'displayName',
        opStr: '==',
        value: 'fake-name',
    }
    const newQuery = {
        where: [Query.whereActive, Query.whereNoExpiration, newWhere],
    };
    customRender(<ItemList path={path} query={newQuery}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    screen.getByText('Oops, theres nothing here.');
});

it('renders NothingHere if filter filters all items', async () => {
    const filter = (() => false);
    customRender(<ItemList {...props} filter={filter}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    rendersNothingHere();
});
