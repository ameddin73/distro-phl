import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Item';
import {ItemMocks} from "util/test/item.mock";
import {configure, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import {TypesMocks} from "util/test/type.mock";

describe('Item', () => {
    configure({adapter: new Adapter()});
    const mockDefaultTypes = TypesMocks.defaultTypes;

    const mockedUseItemTypes =

        jest.mock("../../../util/hooks/useItemTypes", () => ({
            useItemTypes: () => mockDefaultTypes,
        }));

    it('should mount', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Item item={ItemMocks.defaultItem}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders correctly', () => {
        const wrapper = shallow(<Item item={ItemMocks.defaultItem}/>);
        expect(wrapper).toMatchSnapshot();
    });
});