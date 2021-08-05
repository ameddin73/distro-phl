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
    chats: '/chats/',
    messages: '/messages/',
}

const userPaths = {
    base: '/user',
    login: '/signIn',
    posts: '/posts',
    newPost: '/new-post',
    chats: '/chats',
}
export const PATHS = {
    public: {
        base: '/',
        distro: '/distro',
        user: '/user',
        posts: '/posts',
        login: `${userPaths.base}${userPaths.login}`,
        userPosts: `${userPaths.base}${userPaths.posts}`,
        newPost: `${userPaths.base}${userPaths.newPost}`,
        chats: `${userPaths.base}${userPaths.chats}`,
    },
    user: {
        login: `${userPaths.login}`,
        posts: `${userPaths.posts}`,
        newPost: `${userPaths.newPost}`,
        chats: `${userPaths.chats}`,
    },
};

export const DEFAULT_IMAGE = {
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/distro-phl-2a16a.appspot.com/o/images%2Fapp%2Fdistro-phl_thumbnail.jpg?alt=media&token=9cc4f2f9-649a-4b58-8276-79bc923f0563',
    small: 'https://firebasestorage.googleapis.com/v0/b/distro-phl-2a16a.appspot.com/o/images%2Fapp%2Fdistro-phl_480.jpg?alt=media&token=0cd580d7-969a-407a-9aee-eceb74ddc8d7',
    medium: 'https://firebasestorage.googleapis.com/v0/b/distro-phl-2a16a.appspot.com/o/images%2Fapp%2Fdistro-phl_720.jpg?alt=media&token=76a65e57-6ffc-401d-8d75-ca587f6ec81b',
    large: 'https://firebasestorage.googleapis.com/v0/b/distro-phl-2a16a.appspot.com/o/images%2Fapp%2Fdistro-phl_1200.jpg?alt=media&token=ad5f5ddc-be56-4646-b97c-1d16d4b2d2cd',
}

export const POST_NAME_LENGTH = 50;
export const POST_DESCRIPTION_LENGTH = 250;

export const STORAGE = {
    postImages: 'images/posts/',
}