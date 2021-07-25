/**
 * @jest-environment test/jest-env
 */
import React, {PropsWithChildren} from 'react';
import {customRender, rendersNothingHere, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {screen, waitFor} from "@testing-library/react";
import {COLLECTIONS} from "util/config";
import {PostQuery} from "util/utils";
import {FirestoreQueryWhere, PostInterface} from "util/types.distro";
import {UserMocks} from "test/mocks/user.mock";
import PostList from "./PostList";

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
    await renderPostList(<PostList {...props}/>);
}, 60000);

it('renders all posts', async () => {
    await renderPostList(<PostList {...props}/>);
    const posts = screen.getAllByText('Posted by');
    expect(posts.length).toBeGreaterThanOrEqual(3);
});

it('filters posts', async () => {
    const filter = ((post: PostInterface) => post.uid === UserMocks.userThree.uid);
    await renderPostList(<PostList {...props} filter={filter}/>);
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
    await renderPostList(<PostList path={path} query={newQuery}/>);
    screen.getByText('Oops, theres nothing here.');
});

it('renders NothingHere if filter filters all posts', async () => {
    const filter = (() => false);
    await renderPostList(<PostList {...props} filter={filter}/>)
    rendersNothingHere();
});

async function renderPostList(postList: PropsWithChildren<any>) {
    customRender(postList);
    await waitFor(() =>
        expect(document.querySelector(`#${postList.type.name}`)).toBeNull());
}
