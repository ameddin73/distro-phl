/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import {customRender, setupFirebase, teardownFirebase} from "test/utils";
import User from './User';

beforeAll(async () => {
    await setupFirebase();
});
afterAll(teardownFirebase);

it('should mount', async () => {
    customRender(<User/>);
});
