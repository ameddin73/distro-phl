/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase} from "test/utils";
import {ItemMocks} from "test/mocks/item.mock";
import {TypesMocks} from "test/mocks/type.mock";
import PostComponent from "./PostComponent";

const mockDefaultItem = ItemMocks.defaultItem;
const mockTypes = TypesMocks.defaultTypes;
const testPostActionText = 'test item action text';

const TestPostAction = () => (
    <div>{testPostActionText}</div>
)
beforeAll(setupFirebase);
beforeEach(async () => {
    customRender(<PostComponent post={mockDefaultItem}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);
afterEach(async () => await resetFirebase());

it('should mount', async () => {
});

it('renders post details properly', async () => {
    screen.getByText(mockDefaultItem.displayName);
    screen.getByText(mockTypes[mockDefaultItem.type].displayName);
    screen.getByText(mockDefaultItem.description);
    screen.getByText(mockDefaultItem.userName);
});

it('renders item action properly', async () => {
    customRender(<PostComponent post={mockDefaultItem} postAction={TestPostAction}/>);
    await waitFor(() => screen.getByText(testPostActionText));
});