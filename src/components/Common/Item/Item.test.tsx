/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import Item from "./Item";
import {customRender, resetFirebase, setupFirebase} from "test/utils";
import {ItemMocks} from "test/mocks/item.mock";
import {TypesMocks} from "test/mocks/type.mock";

const mockDefaultItem = ItemMocks.defaultItem;
const mockTypes = TypesMocks.defaultTypes;
const testItemActionText = 'test item action text';

const TestItemAction = () => (
    <div>{testItemActionText}</div>
)
beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<Item item={mockDefaultItem}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());

it('should mount', async () => {
});

it('renders item details properly', async () => {
    screen.getByText(mockDefaultItem.displayName);
    screen.getByText(mockTypes[mockDefaultItem.type].displayName);
    screen.getByText(mockDefaultItem.description);
    screen.getByText(mockDefaultItem.userName);
});

it('renders item action properly', async () => {
    customRender(<Item item={mockDefaultItem} itemAction={TestItemAction}/>);
    await waitFor(() => screen.getByText(testItemActionText));
});