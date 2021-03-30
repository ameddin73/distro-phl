/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {cleanup, screen} from "@testing-library/react";
import Item from "./Item";
import {customRender} from "test/utils";
import {ItemMocks} from "test/mocks/item.mock";
import {TypesMocks} from "test/mocks/type.mock";
import {useItemTypes} from "util/hooks/useItemTypes";

const mockDefaultItem = ItemMocks.defaultItem;
const mockTypes = TypesMocks.defaultTypes;
jest.mock('util/hooks/useItemTypes', () => ({
    useItemTypes: jest.fn(),
}));

beforeAll(async () => {
});
afterEach(cleanup);

it('should mount', () => {
    // @ts-ignore
    useItemTypes.mockReturnValue(mockTypes);
    customRender(<Item item={mockDefaultItem}/>);
    screen.getByText(mockDefaultItem.displayName);
});

it('renders correctly', () => {
    // @ts-ignore
    useItemTypes.mockReturnValue(mockTypes);
    const renderer = customRender(<Item item={mockDefaultItem}/>);
    // const wrapper = shallow(<Item item={mockDefaultItem}/>);
    // expect(wrapper).toMatchSnapshot();
});