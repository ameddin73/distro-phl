/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {screen, waitFor} from "@testing-library/react";
import {customRender, resetFirebase, setupFirebase, teardownFirebase} from "test/utils";
import {PostMocks} from "test/mocks/post.mock";
import {PostInterface} from "util/types.distro";
import PostImage from "./PostImage";

const mockDefaultPost = PostMocks.defaultPost as PostInterface;
const mockSecondaryPost = PostMocks.secondaryPost as PostInterface;
const mockTertiaryPost = PostMocks.tertiaryPost as PostInterface;

beforeAll(setupFirebase);
afterEach(async () => await resetFirebase());
afterAll(teardownFirebase);

it('should render thumbnail', async () => {
    await load(mockDefaultPost);
    screen.queryAllByAltText(`${mockDefaultPost.name} thumbnail`);
});

it('should render main image on fallback', async () => {
    await load(mockTertiaryPost);
    screen.getByAltText(`${mockTertiaryPost.name}`);
});


it('should render default image on fallback', async () => {
    await load(mockSecondaryPost);
    screen.getByAltText('Default thumbnail');
});

async function load(post: PostInterface) {
    customRender(<PostImage name={post.name} image={post.image}/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull(), {timeout: 60000})
}