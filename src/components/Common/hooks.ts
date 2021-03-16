import React, {useState} from "react";
import {v4} from 'uuid';

export const useInput = (initialValue?: any) => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event: React.FormEvent<HTMLInputElement>) => setValue((event.target as HTMLInputElement).value),
        }
    };
};

export const bindIds = ({ids, value}: { ids: string[], value: any }) => {
    const object: { [key: string]: any } = {};
    value.forEach((item: any, index: number) => (object[ids[index]] = item));
    return object;
};

export const getFileWithUUID = (file: File) => {
    Object.defineProperty(file, 'name', {
        writable: true,
        value: file.name.replace(/^[^.]*/, v4()),
    });
    return file;
}