import moment from "moment";

import {
  faTicket,
  faPrint,
  faIdCard,
  faPersonSwimming,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";

export const deafaultCoupon = {
  _id: null,
  couponCode: "NEW_COUPON",
  value: 10,
  serviceType: 0,
  unit: 0,
  description: "NEW_COUPON",
  maxQuantity: 10,
  count: 0,
  startTime: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  expiryTime: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  isAvailable: true,
  requireWhiteList: false,
  useCoupon: "QR",
  createdAt: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  updatedAt: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
};

export const services = {
  1: {
    name: "Mới nhất",
    icon: faTicket,
  },
  2: {
    name: "In ấn",
    icon: faPrint,
  },
  3: {
    name: "GPLX",
    icon: faIdCard,
  },
  4: {
    name: "Hồ bơi",
    icon: faPersonSwimming,
  },
  5: {
    name: "Đồng phục",
    icon: faShirt,
  },
};
