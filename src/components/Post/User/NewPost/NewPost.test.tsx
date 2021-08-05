/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {PostMocks} from "test/mocks/post.mock";
import {COLLECTIONS, PATHS, STORAGE} from "util/config";
import {v4} from "uuid";
import firebase from "firebase/app";
import {getFirebase, resetFirebase, setupFirebase, signIn, teardownFirebase, waitForSuspendedRender} from "test/utils";
import NewPost from './NewPost';
import {Converters} from "util/utils";

jest.mock('util/utils', () => {
    jest.unmock('util/utils');
    return {
        __esModule: true,
        ...jest.requireActual('util/utils'),
        getCompressedImages: () => {
            class MockFile {
                name: string;

                constructor(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], filename: string) {
                    this.name = filename;
                }
            }

            return Promise.resolve([
                new MockFile([], 'a0.jpeg'),
                new MockFile([], 'thumbnail.a0.jpeg'),
            ]);
        },
    }
});
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
    await waitForSuspendedRender(<NewPost/>);
});
afterEach(async () => resetFirebase());
afterAll(teardownFirebase);

describe('validate form', () => {
    it('should mount', () => {
    });

    it('renders all fields', () => {
        screen.getByText('Name');
        screen.getByText('Description');
        screen.getByText('Submit');
    });

    it('attaches image', async () => {
        fireEvent.click(screen.getByLabelText('upload-image'));
        fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'a0.jpeg')]}})
        await waitFor(() => expect((screen.getByLabelText('uploaded-image') as HTMLImageElement)).toHaveStyle('background-image: url(a0.jpeg)'));
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
        await waitFor(() => expect(window.location.pathname).toBe(PATHS.public.userPosts), {timeout: 5000});
    }, 5000);
});

describe('firebase functionality', () => {
    it('creates new post', async () => {
        await createPost();
    });

    it('creates new post with image', async () => {
        const putSpy = jest.fn().mockReturnValue(Promise.resolve());
        // @ts-ignore
        getFirebase().storage().ref = () => ({
            child: (path: string) => getFirebase().storage().ref(path),
            // @ts-ignore
            put: putSpy,
            fullPath: `${STORAGE.postImages}a0.jpg`,
        });
        fireEvent.click(screen.getByLabelText('upload-image'));
        fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'a0.jpeg')]}})
        await waitFor(() => expect((screen.getByLabelText('uploaded-image') as HTMLImageElement)).toHaveStyle('background-image: url(a0.jpeg)'));
        const post = await createPost();
        // @ts-ignore
        expect(post.data().image).toBeTruthy();
        await waitFor(() => expect(putSpy).toBeCalledTimes(2));
        await waitFor(() => expect(putSpy).toBeCalledWith(expect.anything(), {cacheControl: 'public,max-age=31536000'}));
    });

    it('creates new post with expiration', async () => {
        fireEvent.click(screen.getByLabelText('expiration-checkbox'));
        fireEvent.change(screen.getByTestId('expiration-date-picker'), {target: {value: '04/20/2099'}});
        const post = await createPost();
        // @ts-ignore
        expect(post.data().expires.getFullYear()).toBe((new Date('2099-04-20')).getFullYear());
    });

    it('does not create dupes on double click', async () => {
        const testName = v4();
        fireEvent.change(screen.getByLabelText('name'), {target: {value: testName}});
        fireEvent.change(screen.getByLabelText('description'), {target: {value: PostMocks.defaultPost.description}});
        fireEvent.click(screen.getByText('Submit'));
        expect(screen.queryByText('Submit')).toBeNull();
    });

    it('cleans up if image upload error', async () => {
        const promise = new Promise(() => {
            throw new Error('mock error')
        });
        // https://stackoverflow.com/a/59062117/3434441
        promise.catch(() => null);
        await setupFailure(promise, STORAGE.postImages + v4() + '.jpg');
    });

    it('cleans up if add post error', async () => {
        await setupFailure(Promise.resolve(), 'badpath');
    });
});

async function createPost(succeed: boolean = true) {
    const testName = v4();
    fireEvent.change(screen.getByLabelText('name'), {target: {value: testName}});
    fireEvent.change(screen.getByLabelText('description'), {target: {value: PostMocks.defaultPost.description}});
    fireEvent.click(screen.getByText('Submit'));
    const {docs: posts} = await postRef.get();
    if (succeed) {
        await waitFor(() => expect(posts.find(post => post.data().name === testName)).toBeTruthy());
        return posts.find(post => post.data().name === testName);
    } else {
        return testName;
    }
}

async function setupFailure(putPromise: Promise<unknown>, path: string) {
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
    fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'a0.jpeg')]}})

    await waitFor(() => expect((screen.getByLabelText('uploaded-image') as HTMLImageElement)).toHaveStyle('background-image: url(a0.jpeg)'));
    const testName = await createPost(false);
    await waitFor(() => expect(deleteSpy).toBeCalled());

    await waitFor(async () => {
        const snapShot = await postRef.where('name', '==', testName).get()
        expect(snapShot.docs.length).toBe(0);
    });
}