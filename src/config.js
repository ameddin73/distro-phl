export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const collections = {
    items: '/items/',
    types: '/item_types',
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