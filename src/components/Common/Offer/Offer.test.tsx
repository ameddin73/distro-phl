/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen} from "@testing-library/react";
import {customRender, setupFirebase, teardownFirebase} from "test/utils";
import Offer from "./Offer";
import {OfferMocks} from "test/mocks/offer.mock";
import {OfferInterface} from "util/types";

let mockDefaultOffer: OfferInterface;

beforeAll(setupFirebase);
beforeEach(() => {
    mockDefaultOffer = new OfferInterface(OfferMocks.defaultOffer);
    customRender(<Offer {...mockDefaultOffer}/>);
});
afterAll(teardownFirebase);

it('renders offer details properly', () => {
    screen.getByText(mockDefaultOffer.userName);
    screen.getByText(mockDefaultOffer.getCreatedAsString());
    screen.getByText(mockDefaultOffer.message);
});