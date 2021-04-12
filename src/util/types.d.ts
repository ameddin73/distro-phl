import firebase from "firebase/app";
import FieldPath = firebase.firestore.FieldPath;
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;

export type FirestoreQueryWhere = {
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
};
export type FirestoreQueryOrderBy = {
    fieldPath: string | FieldPath,
    directionStr?: OrderByDirection
};
export type FirestoreQuery = {
    where?: FirestoreQueryWhere[],
    orderBy?: FirestoreQueryOrderBy[],
    limit?: number,
};