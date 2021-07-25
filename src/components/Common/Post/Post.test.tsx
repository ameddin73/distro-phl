/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen} from "@testing-library/react";
import {HistoryWrapper, resetFirebase, setupFirebase, teardownFirebase, waitForSuspendedRender} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import {PATHS} from "util/config";
import {Route} from "react-router-dom";
import {PostInterface} from "util/types.distro";
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
    }, 30000);
    afterAll(teardownFirebase);

    it('should mount', async () => {
    });

    it('renders post details properly', () => {
        screen.getByText(mockDefaultPost.name);
        screen.getByText(mockDefaultPost.description);
        screen.getByText(mockDefaultPost.userName);
    });
});

async function load(path: string) {
    await waitForSuspendedRender(
        <HistoryWrapper component={<Route path={`${PATHS.public.posts}/:id`}><Post/></Route>} path={path}/>);
}