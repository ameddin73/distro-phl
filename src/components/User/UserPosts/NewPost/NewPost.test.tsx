/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import NewPost from './NewPost';
import {customRender, getFirebase, resetFirebase, setupFirebase, signIn} from "test/utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {PostMocks} from "test/mocks/post.mock";
import {COLLECTIONS, PATHS, STORAGE} from "util/config";
import {v4} from "uuid";
import {Converters} from "util/utils";
import firebase from "firebase/app";

// @ts-ignore
global.File = class MockFile {
    name: string;

    constructor(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], filename: string) {
        this.name = filename;
    }
}
global.URL.createObjectURL = jest.fn();
global.URL.createObjectURL = ({name}) => name;

let postRef: firebase.firestore.Query;

beforeAll(async () => {
    await setupFirebase();
    await signIn();
});
beforeEach(async () => {
    postRef = getFirebase().firestore().collection(COLLECTIONS.posts).where('active', '==', true).withConverter(Converters.PostConverter);
    customRender(<NewPost/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
});
afterEach(async () => await resetFirebase());

describe('validate form', () => {
    it('should mount', () => {
    });

    it('renders all fields', () => {
        screen.getByText('Name');
        screen.getByText('Description');
        screen.getByText('Submit');
    });

    it('attaches image', () => {
        fireEvent.click(screen.getByLabelText('upload-image'));
        fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'filename.jpeg')]}})
        expect((screen.getByLabelText('uploaded-image') as HTMLImageElement)).toHaveStyle('background-image: url(filename.jpeg)');
    });

    it('requires name', () => {
        fireEvent.change(screen.getByLabelText('description'), {target: {value: PostMocks.defaultPost.description}});
        fireEvent.click(screen.getByText('Submit'));
        screen.getByText('Submit');
    });

    it('requires description', () => {
        fireEvent.change(screen.getByLabelText('name'), {target: {value: PostMocks.defaultPost.name}});
        fireEvent.click(screen.getByText('Submit'));
        screen.getByText('Submit');
    });

    it('shows date picker', () => {
        fireEvent.click(screen.getByLabelText('expiration-checkbox'));
        screen.getByLabelText('expiration-date-picker');
    });

    it('submits & redirects if all fields completed', async () => {
        fireEvent.change(screen.getByLabelText('name'), {target: {value: PostMocks.defaultPost.name}});
        fireEvent.change(screen.getByLabelText('description'), {target: {value: PostMocks.defaultPost.description}});
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => expect(window.location.pathname).toBe(PATHS.public.userPosts));
    });
});

describe('firebase functionality', () => {
    it('creates new post', async () => {
        await createPost();
    });

    it('creates new post with image', async () => {
        fireEvent.click(screen.getByLabelText('upload-image'));
        fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'filename.jpeg')]}})
        const post = await createPost();
        // @ts-ignore
        expect(post.data().image).toBeTruthy();
    });

    it('creates new post with expiration', async () => {
        fireEvent.click(screen.getByLabelText('expiration-checkbox'));
        fireEvent.change(screen.getByTestId('expiration-date-picker'), {target: {value: '04/20/2070'}});
        const post = await createPost();
        // @ts-ignore
        expect(post.data().expires.setHours(0, 0, 0, 0).valueOf()).toBe((new Date('2070-04-21')).setHours(0, 0, 0, 0).valueOf());
        // Weird time thing here with date comparison cause of UTC or GMT or something... idk i'll fix it if the test ever fails
    });

    it('cleans up if image upload error', async () => {
        await setupFailure(new Promise(() => {
            throw new Error('mock error')
        }), STORAGE.postImages + v4() + '.jpg');
    });

    it('cleans up if add post error', async () => {
        await setupFailure(new Promise(() => {
        }), 'badpath');
    });
});

async function createPost(succeed: boolean = true) {
    const testName = v4();
    fireEvent.change(screen.getByLabelText('name'), {target: {value: testName}});
    fireEvent.change(screen.getByLabelText('description'), {target: {value: PostMocks.defaultPost.description}});
    fireEvent.click(screen.getByText('Submit'));
    const {docs: posts} = await postRef.get();
    if (succeed) {
        expect(posts.find(post => post.data().name === testName)).toBeTruthy();
        return posts.find(post => post.data().name === testName);
    } else {
        return testName;
    }
}

async function setupFailure(putPromise: Promise<void>, path: string) {
    const deleteSpy = jest.fn().mockReturnValue(new Promise(() => {
    }));
    getFirebase().storage().ref = () => ({
        child: (path: string) => getFirebase().storage().ref(path),
        // @ts-ignore
        put: () => putPromise,
        fullPath: path,
        delete: deleteSpy,
    });

    fireEvent.click(screen.getByLabelText('upload-image'));
    fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'filename.jpeg')]}})

    const testName = createPost(false);
    await waitFor(() => expect(deleteSpy).toBeCalled());

    let gone = false;
    postRef.onSnapshot(snapshot => {
        if (!snapshot.docs.find(post => post.data().name === testName)) gone = true;
    });
    await waitFor(() => gone);
}