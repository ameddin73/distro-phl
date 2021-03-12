import {useState} from "react";
import {v4 as uuidv4} from 'uuid';

export const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: event => setValue(event.target.value),
        }
    };
};

export const bindIds = ({ids, value}) => {
    value.forEach((item, index) => (item.id = ids[index]));
    return value;
};

export const getFileWithUUID = (file) => {
    Object.defineProperty(file, 'name', {
        writable: true,
        value: file.name.replace(/^[^.]*/, uuidv4()),
    });
    return file;
}