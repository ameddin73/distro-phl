import {InitializeAppArgs} from "@react-firebase/firestore/dist/types";

export const firebaseConfig: InitializeAppArgs = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: '',
    firebase: '',
};

export const collections = {
    items: '/items/',
    types: '/item_types/',
    reservations: '/reservations/',
    confirmations: '/confirmations',
    completed: '/completed_items',
}

export const paths = {
    public: {
        base: '/',
        distro: '/distro',
        user: '/user*',
        login: '/user/login',
        userItems: '/user/items',
        createItem: '/user/add',
    },
    user: {
        login: '/login',
        items: '/items',
        create: '/add',
    },
};

export const descriptionLength = 250;
export const defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/pheeding-philly.appspot.com/o/bread.JPG?alt=media&token=6532387c-9157-4f57-ac8d-82f1a8db9cfc'

export const storage = {
    itemImage: 'images/items/',
}