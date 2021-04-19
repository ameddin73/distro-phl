import React, {createContext, useState} from 'react';
import {Slide, SlideProps, Snackbar} from "@material-ui/core";
import {Alert, Color} from "@material-ui/lab";

export const SnackbarContext = createContext<(severity: Color, message: string) => void>(() => null);

const SnackbarProvider: React.FC = (props) => {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState<Color>()
    const [privateMessage, setPrivateMessage] = useState<string>()

    const openSnackbar = (severity: Color, message: string) => {
        setColor(severity);
        setPrivateMessage(message);
        setOpen(true);
    }
    const closeSnackbar = () => {
        setOpen(false);
    }

    return (
        <SnackbarContext.Provider value={openSnackbar}>
            {props.children}
            <Snackbar style={{position: 'absolute'}} open={open} aria-label="snackbar" autoHideDuration={3000} onClose={closeSnackbar} TransitionComponent={SlideTransition}>
                <Alert variant="filled" severity={color} onClose={closeSnackbar}>{privateMessage}</Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
    return <Slide {...props} direction="up"/>;
}

export default SnackbarProvider;