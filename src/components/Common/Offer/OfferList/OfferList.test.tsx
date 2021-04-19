/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, rendersNothingHere, resetFirebase, setupFirebase, teardownFirebase} from "src/test/utils";
import {screen, waitFor} from "@testing-library/react";
import {COLLECTIONS} from "src/util/config";
import {PostQuery} from "src/util/utils";
import {FirestoreQueryWhere, PostInterface} from "src/util/types";
import {UserMocks} from "src/test/mocks/user.mock";
import OfferList from "./OfferList";

const path = COLLECTIONS.posts;
const query = {
    where: [PostQuery.where.active],
    orderBy: [PostQuery.orderBy.created],
}
const props = {path, query};

beforeAll(setupFirebase);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should mount', async () => {
    customRender(<OfferList {...props}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}, 60000);

it('renders all posts', async () => {
    customRender(<OfferList {...props}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    const posts = screen.getAllByText('Posted by');
    expect(posts.length).toBeGreaterThanOrEqual(3);
});

it('filters posts', async () => {
    const filter = ((post: PostInterface) => post.uid !== UserMocks.defaultUser.uid);
    customRender(<OfferList {...props} filter={filter}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    const posts = screen.getAllByText('Posted by');
    expect(posts.length).toBe(1);
});

it('renders NothingHere if query returns empty list', async () => {
    const newWhere: FirestoreQueryWhere = {
        fieldPath: 'displayName',
        opStr: '==',
        value: 'fake-name',
    }
    const newQuery = {
        where: [PostQuery.where.active, newWhere],
    };
    customRender(<OfferList path={path} query={newQuery}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    screen.getByText('Oops, theres nothing here.');
});

it('renders NothingHere if filter filters all posts', async () => {
    const filter = (() => false);
    customRender(<OfferList {...props} filter={filter}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
    rendersNothingHere();
});
