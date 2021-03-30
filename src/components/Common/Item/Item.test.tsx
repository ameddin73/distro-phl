/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitForElementToBeRemoved} from "@testing-library/react";
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
afterEach(async () => await resetFirebase());

it('should mount', async () => {
    customRender(<Item item={mockDefaultItem}/>);
    expect(document.querySelector('#fallback')).toBeInTheDocument();
    await waitForElementToBeRemoved(document.querySelector('#fallback'));
    screen.getByText(mockDefaultItem.displayName);
});

it('renders item details properly', async () => {
    customRender(<Item item={mockDefaultItem}/>);
    expect(document.querySelector('#fallback')).toBeInTheDocument();
    await waitForElementToBeRemoved(document.querySelector('#fallback'));
    screen.getByText(mockDefaultItem.displayName);
    screen.getByText(mockTypes[mockDefaultItem.type].displayName);
    screen.getByText(mockDefaultItem.description);
    screen.getByText(mockDefaultItem.userName);
});

it('renders item action properly', async () => {
    customRender(<Item item={mockDefaultItem} itemAction={TestItemAction}/>);
    await waitForElementToBeRemoved(document.querySelector('#fallback'));
    screen.getByText(testItemActionText);
});