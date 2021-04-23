/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, HistoryWrapper, resetFirebase, setupFirebase, signIn, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import {PATHS} from "util/config";
import {Route} from "react-router-dom";
import {UserMocks} from "test/mocks/user.mock";
import {PostInterface} from "util/types";
import Post from "./Post";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;

beforeAll(setupFirebase);
afterEach(async () => await resetFirebase(true));

it('renders 404 if item not found', async () => {
    await load(`${PATHS.public.posts}/bad-id`);
    screen.getByLabelText('404 not found');
});

describe('post exists', () => {
    beforeEach(async () => {
        await load(`${PATHS.public.posts}/preset-post-0`);
    }, 60000);
    afterAll(teardownFirebase);

    it('should mount', async () => {
    });

    it('renders post details properly', () => {
        screen.getByText(mockDefaultPost.name);
        screen.getByText(mockDefaultPost.description);
        screen.getByText(mockDefaultPost.userName);
    });

    it('renders user action properly', async () => {
        await signIn(UserMocks.defaultUser);
        await waitFor(() => screen.getByText('Delete Post'));
    });

    it('renders distro action properly', async () => {
        await waitFor(() => screen.getByText(/Respond/));
        await signIn(UserMocks.userTwo);
        await waitFor(() => screen.getByText(/Respond/));
    });
});

async function load(path: string) {
    customRender(<HistoryWrapper component={<Route path={`${PATHS.public.posts}/:id`}><Post/></Route>} path={path}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000});
}