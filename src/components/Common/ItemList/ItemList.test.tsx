/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import ItemList from "./ItemList";
import {customRender, resetFirebase, setupFirebase} from "../../../test/utils";
import {screen, waitFor} from "@testing-library/react";
import {COLLECTIONS} from "util/config";
import {Query} from "util/utils";

const path = COLLECTIONS.items;
const orderBy = Query.orderByCreated;
const query = {
    where: [Query.whereActive],
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
    expect(items.length).toBe(7);
});