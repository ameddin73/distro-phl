import {COLLECTIONS} from "../config";
import {buildTypesObject, Converters} from "../utils";
import {FirestoreQuery, ItemTypes} from "../types";
import useFirestoreCollectionBuilder from "./useFirestoreCollectionBuilder";

export function useItemTypes(): ItemTypes {
    const path = COLLECTIONS.types;
    const converter = Converters.itemTypeConverter;
    const query: FirestoreQuery = {
        where: [],
        orderBy: {
            fieldPath: 'index',
            directionStr: 'asc',
        }
    };

    const {data: types} = useFirestoreCollectionBuilder(path, query, converter);
    return buildTypesObject(types);
}