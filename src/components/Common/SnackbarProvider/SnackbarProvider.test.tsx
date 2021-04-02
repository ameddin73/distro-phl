import React, {useContext} from 'react';
import {SnackbarContext} from './SnackbarProvider';
import {screen, waitForElementToBeRemoved} from "@testing-library/react";
import {customRender, setupFirebase} from "../../../test/utils";

const successMessage = 'success message';

beforeAll(setupFirebase);

it('Opens correctly', async () => {
    customRender(<TestSnackbar testSnack={testSnack}/>);
    testSnack.testSnackbar();
    screen.getByText(successMessage);
});

it('Autohides', async () => {
    customRender(<TestSnackbar testSnack={testSnack}/>);
    testSnack.testSnackbar();
    await waitForElementToBeRemoved(() => screen.getByText(successMessage), {timeout: 3500});
});

const testSnack = {
    openSnackbar: () => null,
    testSnackbar: () => null,
}
testSnack.testSnackbar = () => testSnack.openSnackbar();

const TestSnackbar = ({testSnack}: { testSnack: any }) => {
    const openSnackbar = useContext(SnackbarContext)

    testSnack.openSnackbar = () => openSnackbar('success', successMessage);

    return <></>;
}