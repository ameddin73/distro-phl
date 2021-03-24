import {ChangeEvent, SyntheticEvent, useState} from "react";

const useInput = (initialValue?: any) => {
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

export default useInput;