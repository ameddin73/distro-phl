export const FIREBASE_CONFIG = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const COLLECTIONS = {
    posts: '/posts/',
    offers: '/offers/',
    confirmations: '/confirmations',
}

const userPaths = {
    base: '/user',
    login: '/signIn',
    posts: '/posts',
    new: '/add',
}
export const PATHS = {
    public: {
        base: '/',
        distro: '/distro',
        user: '/user',
        posts: '/posts',
        login: `${userPaths.base}${userPaths.login}`,
        userPosts: `${userPaths.base}${userPaths.posts}`,
        newPost: `${userPaths.base}${userPaths.new}`,
    },
    user: {
        login: `${userPaths.login}`,
        posts: `${userPaths.posts}`,
        new: `${userPaths.new}`,
    },
};

export const DESCRIPTION_LENGTH = 250;
export const DEFAULT_IMAGE = 'images/posts/bread.JPG'

export const STORAGE = {
    postImages: 'images/posts/',
}