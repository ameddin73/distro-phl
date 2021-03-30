import React, {PropsWithChildren, Suspense} from "react";
import {ThemeProvider} from "@material-ui/styles";
import {FirebaseAppProvider} from "reactfire";
import {FIREBASE_CONFIG} from "util/config";
import theme from "util/theme";
import {render, RenderOptions} from "@testing-library/react";
import SnackbarProvider from "../components/Common/SnackbarProvider/SnackbarProvider";

export const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, {wrapper: Providers, ...options});

const Providers = ({children}: PropsWithChildren<any>) => (
    <ThemeProvider theme={theme}>
        <FirebaseAppProvider firebaseConfig={FIREBASE_CONFIG} suspense>
            <SnackbarProvider>
                <Suspense fallback={<div/>}>
                    {children}
                </Suspense>
            </SnackbarProvider>
        </FirebaseAppProvider>
    </ThemeProvider>
)
