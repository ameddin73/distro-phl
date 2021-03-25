import {ItemTypes} from "util/types";

export namespace TypesMocks {
    export const defaultTypes: ItemTypes = {
        "perishable": {
            "consumable": true,
            "displayName": "Perishable Food",
            "expires": true,
            "id": "perishable",
            "index": 0
        },
        "non-perishable": {
            "consumable": true,
            "displayName": "Non-Perishable Food",
            "expires": false,
            "id": "non-perishable",
            "index": 1
        },
        "medical-item": {
            "consumable": true,
            "displayName": "Medical Item",
            "expires": false,
            "id": "medical-item",
            "index": 2
        },
        "hygiene": {
            "consumable": true,
            "displayName": "Hygiene",
            "expires": false,
            "id": "hygiene",
            "index": 3
        },
        "clothes": {
            "consumable": true,
            "displayName": "Clothing",
            "expires": false,
            "id": "clothes",
            "index": 4
        },
        "medical-service": {
            "consumable": false,
            "displayName": "Medical Service",
            "expires": true,
            "id": "medical-service",
            "index": 5
        },
        "other-item-perishable": {
            "consumable": true,
            "displayName": "Other Perishable",
            "expires": true,
            "id": "other-item-perishable",
            "index": 6
        },
        "other-item-non-perishable": {
            "consumable": true,
            "displayName": "Other Non-Perishable",
            "expires": false,
            "id": "other-item-non-perishable",
            "index": 7
        },
        "other-service": {
            "consumable": false,
            "displayName": "Other Service",
            "expires": true,
            "id": "other-service",
            "index": 9
        }
    }
}