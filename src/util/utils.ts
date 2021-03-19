import {FirestoreMember} from "./types";
import {v4} from "uuid";

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