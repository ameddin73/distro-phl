/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import NewPost from './NewPost';
import {customRender, resetFirebase, setupFirebase, signIn} from "test/utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";

// @ts-ignore
global.File = class MockFile {
    name: string;
    constructor(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], filename: string, properties ?: FilePropertyBag) {
        this.name = filename;
    }
}
global.URL.createObjectURL = jest.fn();

beforeAll(async () => {
    await setupFirebase();
    await signIn();
});
beforeEach(async () => {
    customRender(<NewPost/>);
    await waitFor(() => expect(document.querySelector('#loading')).toBeNull())
});
afterEach(async () => await resetFirebase());

it('should mount', () => {
});

it('renders all fields', () => {
    screen.getByText('Post a new item.');
    screen.getByText('Name');
    screen.getByText('Type');
    screen.getByText('Description');
    screen.getByText('Submit');
});

it('attaches image', () => {
    global.URL.createObjectURL = ({name}) => name;
    fireEvent.click(screen.getByLabelText('upload-image'));
    fireEvent.change(screen.getByTestId('image-input'), {target: {files: [new File(['parts'], 'filename.jpeg')]}})
    expect((screen.getByLabelText('uploaded-image') as HTMLImageElement)).toHaveStyle('background-image: url(filename.jpeg)');
});

// TODO complete test after feature changes