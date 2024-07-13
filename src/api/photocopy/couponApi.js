import axiosClient from './axiosClient';

class CouponApi {
    applyCode = async (code, total = 0) => {
        return axiosClient.get('/coupons/apply', {
            params: { code, total },
        });
    };
}

export default new CouponApi();
