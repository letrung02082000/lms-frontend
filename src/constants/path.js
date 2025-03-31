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
        HOC_LAI_XE: '/hoc-lai-xe',
        TEST: '/driving-test',
        A1_TEST: '/driving-test/a1',
        A2_TEST: '/driving-test/a2',
        B1_TEST: '/driving-test/b1',
        B2_TEST: '/driving-test/b2',
        REGISTRATION: '/driving-registration',
        INSTRUCTION: '/driving-instruction',
        CENTER: {
            REGISTRATION: '/driving/:shortName',
            INSTRUCTION: '/driving/:shortName/instruction',
            DANG_KY: '/hoc-lai-xe/:shortName',
            HUONG_DAN: 'hoc-lai-xe/:shortName/huong-dan',
        },
        HEALTH_CHECK: '/driving/health',
        ADMIN: {
            ROOT: '/driving/admin',
            STUDENT: '/driving/student',
            PROCESSING: '/driving/admin/processing',
            A1: '/driving/admin/a1',
            A2: '/driving/admin/a2',
            B1: '/driving/admin/b1',
            B2: '/driving/admin/b2',
            C: '/driving/admin/c',
            B12: '/driving/admin/b12',
            COURSE: '/driving/admin/course',
            DATE: '/driving/admin/date',
            CENTER: '/driving/admin/center',
            TYPE: '/driving/admin/type',
            TEACHER: '/driving/admin/teacher',
            VEHICLE: '/driving/admin/vehicle',
        },
    },
    ELEARNING: {
        ROOT: '/elearning',
        ADMIN: {
            ROOT: '/elearning/admin',
            STUDENT: '/elearning/admin/student',
            COURSE: '/elearning/admin/course',
        },
        STUDENT: {
            ROOT: '/elearning/student',
            COURSE: '/elearning/student/course',
            COURSE_DETAIL: '/elearning/student/course/:courseId',
            LESSON: '/elearning/student/lesson',
            LESSON_DETAIL: '/elearning/student/lesson/:lessonId',
            RESULT: '/elearning/student/result',
        }
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
        ROOT: '/shop/66a6617be063722bc1af0f47',
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
        PAYMENT: '/shop/payment',
        MY_ORDER: '/shop/order/my',
        MY_STORE: {
            ROOT: '/shop/my',
            STATISTICS: '/shop/my/statistics',
            ORDER: '/shop/my/order',
            ORDER_DETAIL: '/shop/my/order/:orderId',
            SETTING: '/shop/my/setting',
        },
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
