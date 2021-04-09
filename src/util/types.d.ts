import firebase from "firebase";
import FieldPath = firebase.firestore.FieldPath;
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;

export type FirestoreQueryWhere = {
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
}
export type FirestoreQuery = {
    where: FirestoreQueryWhere[],
    orderBy?: {
        fieldPath: string | FieldPath,
        directionStr?: OrderByDirection
    },
    limit?: number,
}