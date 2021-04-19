/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, HistoryWrapper, resetFirebase, setupFirebase, signIn, teardownFirebase} from "test/utils";
import Post from "./Post";
import {PostMocks} from "test/mocks/post.mock";
import {PATHS} from "../../../util/config";
import {Route} from "react-router-dom";
import {UserMocks} from "../../../test/mocks/user.mock";
import {PostInterface} from "util/types";

const mockDefaultPost = PostMocks.secondaryPost as PostInterface;

beforeAll(setupFirebase);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('renders 404 if item not found', async () => {
    await load(`${PATHS.public.posts}/bad-id`);
    screen.getByText('404');
});

describe('post exists', () => {
    beforeEach(async () => {
        await load(`${PATHS.public.posts}/${mockDefaultPost.id}`);
    }, 60000);

    it('should mount', async () => {
    });

    it('renders post details properly', () => {
        screen.getByText(mockDefaultPost.name);
        screen.getByText(mockDefaultPost.description);
        screen.getByText(mockDefaultPost.userName);
    });

    it('renders post action properly', async () => {
        await signIn(UserMocks.userTwo);
        await waitFor(() => screen.getByLabelText('delete'));
    });
});

async function load(path: string) {
    customRender(<HistoryWrapper component={<Route path={`${PATHS.public.posts}/:id`}><Post/></Route>} path={path}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000});
}