import React from 'react'

function OrderInfo(props) {
  return (
    <div className="px-5">
      <h5 className="text-center my-5">Đặt hàng thành công &#127881;</h5>
      <p>Mã đơn hàng: {props?.orderCode}</p>
      <p>Khách hàng: {props?.name}</p>
      <p>Thể loại: {props?.category?.name}</p>
      <p>Hình thức giao hàng: {props?.isDelivered ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}</p>
      <p>Nhận hàng tại: {props?.isDelivered ? props?.address : props?.office?.name}</p>
      <p>Hướng dẫn in: {props?.instruction}</p>
      <p>Trạng thái: {props?.state === 0 ? 'Chờ xác nhận' : 'Đang xử lý'}</p>
      <h5 className="text-center my-5">Cảm ơn bạn đã sử dụng dịch vụ!</h5>
    </div>
  )
}

export default OrderInfo
