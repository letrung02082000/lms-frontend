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
        ROOT: '/driving-test',
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
        ROOT: '/app',
        STORE: '/app/store',
        CHECKOUT: '/app/checkout',
        ORDER_DETAIL: '/app/order/:orderId',
        ORDER_HISTORY: '/app/order/history',
        ORDER_SUCCESS: '/app/checkout/success',
        STORE_DETAIL: '/app/:storeId',
        STORE_BY_CATEGORY: '/app/category/:categoryId',
        STORE_BY_LOCATION: '/app/location/:locationId',
        PRODUCT_DETAIL: '/app/product/:productId',
    },
};
