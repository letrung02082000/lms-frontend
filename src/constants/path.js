export const PATH = {
    NOT_FOUND: '/404',
    HOME: '/',
    ADMIN: {
        ROOT: '/admin',
    },

    AUTH: {
        ROOT: '/auth',
        SIGNIN: '/auth/login',
        ACTIVATION: '/auth/activate',
        SIGNUP: '/auth/register',
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
        ROOT: '/uniform',
    },
    PHOTOCOPY: {
        ROOT: '/photocopy',
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
        ROOT: '/shop',
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
    GCN: {
        ROOT: '/gcn',
        LIST: '/gcn/list',
        DETAIL: '/gcn/detail/:id',
    },
};
