export const PATH = {
    SHORT_LINK: '/:shortLink',
    NOT_FOUND: '/404',
    HOME: '/',
    ADMIN: {
        ROOT: '/admin',
    },

    AUTH: {
        ROOT: '/auth',
        SIGNIN: '/auth/login',
        OTP: '/auth/otp',
        ACTIVATION: '/auth/activate',
        SIGNUP: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        GOOGLE: '/auth/google',
    },
    ACCOUNT: '/account',
    MAINTAIN: '/maintain',
    USER: {
        ROOT: '/user',
        PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
    },
    EXPLORE: {
        ROOT: '/explore'
    },
    SUPPORT: {
        ROOT: '/support'
    },
    DRIVING_ADMIN: '/driving-admin',
    DRIVING: {
        ROOT: '/driving',
        TEST: '/driving-test',
        A1_TEST: '/driving-test/a1',
        A2_TEST: '/driving-test/a2',
        B1_TEST: '/driving-test/b1',
        B2_TEST: '/driving-test/b2',
        REGISTRATION: '/driving-registration',
        INSTRUCTION: '/driving-instruction',
        ADMIN: {
            ROOT: '/driving/admin',
            DATE: '/driving/admin/date',
        },
    },
    UNIFORM: {
        ROOT: '/shop/666195bad4fed7a40f1016fe',
    },
    PHOTOCOPY: {
        ROOT: '/s/photocopy',
    },
    SWIMMING_POOL: {
        ROOT: '/pool-info',
    },
    GUEST_HOUSE: {
        ROOT: '/guest-house',
    },
    QR_SCAN: {
        ROOT: '/qr-scan',
    },
    YEN_SHARE: {
        ROOT: '/yen-share',
    },
    APP: {
        ROOT: '/',
        STORE: '/shop/store',
        CHECKOUT: '/shop/checkout',
        ORDER_DETAIL: '/shop/order/:orderId',
        ORDER_HISTORY: '/shop/order/history',
        ORDER_SUCCESS: '/shop/checkout/success',
        STORE_DETAIL: '/shop/:storeId',
        STORE_BY_CATEGORY: '/shop/category/:categoryId',
        STORE_BY_LOCATION: '/shop/location/:locationId',
        PRODUCT_DETAIL: '/shop/product/:productId',
    },
    REAL_ESTATE: {
        APARTMENT: '/shop/668d7116dbb560eb9a8fbbf7',
        HOUSE: '/shop/6692322f5b18a435b8e266ec',
    },
    GCN: {
        ROOT: '/gcn',
        USSH: '/gcn/ussh',
        LIST: '/gcn/list',
        DETAIL: '/gcn/detail/:id',
    },
};
