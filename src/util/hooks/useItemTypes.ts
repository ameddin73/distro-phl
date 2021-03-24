import {COLLECTIONS} from "../config";
import {buildTypesObject, Converters} from "../utils";
import {FirestoreQuery} from "../types";
import useFirestoreCollectionBuilder from "./useFirestoreCollectionBuilder";

const useItemTypes = () => {
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

export default useItemTypes;