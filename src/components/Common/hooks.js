import {useState} from "react";

export const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: event => {
                setValue(event.target.value);
            }
        }
    };
};

export const bindIds = ({ids, value}) => {
    value.forEach((item, index) => (item.id = ids[index]));
    return value;
};