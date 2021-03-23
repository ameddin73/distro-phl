import React, {createContext, useState} from 'react';
import {Snackbar} from "@material-ui/core";
import {Alert, Color} from "@material-ui/lab";

export const SnackbarContext = createContext<(severity: Color, message: string) => void>(() => null);

const SnackbarProvider: React.FC = (props) => {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState<Color>()

    const openSnackbar = (severity: Color, message: string) => {
        setColor(severity);
        setOpen(true);
    }
    const closeSnackbar = () => {
        setOpen(false);
    }

    return (
        <SnackbarContext.Provider value={openSnackbar}>
            {props.children}
            <Snackbar open={open} autoHideDuration={3000} onClose={closeSnackbar}>
                <Alert variant="filled" severity={color} onClose={closeSnackbar}>Deleted Successfully.</Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
};

export default SnackbarProvider;