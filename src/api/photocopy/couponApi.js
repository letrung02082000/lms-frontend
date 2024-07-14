import axiosClient from './axiosClient';

class CouponApi {
    applyCode = async (code, total = 0) => {
        return axiosClient.get('/coupons/apply', {
            params: { code, total },
        });
    };

    queryCoupons = async (category, store, storeCategory, serviceType, search='') => {
        return axiosClient.get('/coupons/q', {
            params: {
                visible: true,

            },
        });
    };
}

export default new CouponApi();
