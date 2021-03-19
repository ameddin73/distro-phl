import {ChangeEvent, SyntheticEvent, useState} from "react";
import {v4} from 'uuid';
import {FirestoreMember} from "../../types";

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

export function bindIds<T>(makeObject: boolean, ids: string[], values: T[]): T[];
export function bindIds<T>(makeObject: boolean, ids: string[], values: T[]): { [key: string]: T };

export function bindIds<T extends FirestoreMember>(makeObject: boolean, ids: string[], values: T[]):
    { [key: string]: T } | T[] {
    if (makeObject) {
        const object: { [key: string]: T } = {};
        values.forEach((itemType: T, index: number) => (object[ids[index]] = itemType));
        return object;
    } else {
        values.map((item: T, index: number) => (item.id = ids[index]));
        return values;
    }
}

export const getFileWithUUID = (file: File) => {
    Object.defineProperty(file, 'name', {
        writable: true,
        value: file.name.replace(/^[^.]*/, v4()),
    });
    return file;
}