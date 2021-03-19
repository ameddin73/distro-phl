import {ChangeEvent, SyntheticEvent, useState} from "react";

export const useInput = (initialValue?: any) => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event: SyntheticEvent | ChangeEvent<{ name?: string; value: unknown }>) => setValue((event.target as HTMLInputElement).value),
        }
    };
};
