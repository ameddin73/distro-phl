/**
 * @jest-environment test/jest-env
 */
import React from 'react';
import User from './User';
import {customRender, setupFirebase} from "test/utils";

beforeAll(async () => {
    await setupFirebase();
});

it('should mount', async () => {
    customRender(<User/>);
});
