import React from 'react';
import {cleanup, screen} from "@testing-library/react";
import Item from "./Item";
import {customRender} from "test/utils";
import {ItemMocks} from "test/mocks/item.mock";
import {TypesMocks} from "test/mocks/type.mock";
import {useItemTypes} from "util/hooks/useItemTypes";

jest.mock('util/hooks/useItemTypes', () => ({
    useItemTypes: jest.fn(),
}));

const mockDefaultItem = ItemMocks.defaultItem;
const mockTypes = TypesMocks.defaultTypes;
const testItemActionText = 'test item action text';

const TestItemAction = () => (
    <div>{testItemActionText}</div>
)
afterEach(cleanup);

it('should mount', () => {
    // @ts-ignore
    useItemTypes.mockReturnValue(mockTypes);
    customRender(<Item item={mockDefaultItem}/>);
});

it('renders item details properly', () => {
    // @ts-ignore
    useItemTypes.mockReturnValue(mockTypes);
    customRender(<Item item={mockDefaultItem}/>);
    screen.getByText(mockDefaultItem.displayName);
    screen.getByText(mockTypes[mockDefaultItem.type].displayName);
    screen.getByText(mockDefaultItem.description);
    screen.getByText(mockDefaultItem.userName);
});

it('renders item action properly', () => {
    // @ts-ignore
    useItemTypes.mockReturnValue(mockTypes);
    customRender(<Item item={mockDefaultItem} itemAction={TestItemAction}/>);
    screen.getByText(testItemActionText);
});