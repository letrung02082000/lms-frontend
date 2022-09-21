import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function InstructionModal({ onConfirm, hideModal, data }) {
  return (
    <Modal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Hướng dẫn in</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <div className='fw-bold text-danger mb-2'>Quan trọng:</div>
          <div>
            Chọn "Quan tâm" Zalo Official Account để nhận thông báo về đơn hàng
            tại:
            <br />
            <a
              href='http://zalo.me/4013961016678131109?src=qr'
              target='_blank'
              rel='noreferrer'
            >
              Trung tâm dịch vụ sinh viên iStudent
            </a>
          </div>
        </div>
        <h6>1. Quy trình in chỉ trong 2 giờ</h6>
        <div>
          <div>
            Bước 1:
            <br />- Tải tệp cần in lên
            <br />
            - Hoặc chia sẻ liên kết đến tài liệu
            <br />
            <a
              target={'_blank'}
              rel='noreferrer'
              href='https://www.thegioididong.com/game-app/cach-chia-se-file-tren-google-drive-bang-may-tinh-don-gian-1266542'
            >
              Xem hướng dẫn chia sẻ link Google Drive
            </a>
          </div>
          <hr />
          <div>Bước 2: Nhập hướng dẫn in cho nhân viên</div>
          <div>- Khổ in: A3, A4, A5,...</div>
          <div>- Quy cách in: 1 mặt, 2 mặt, in màu, trắng đen,...</div>
          <div>- Số lượng cần in</div>
          <div>Phần thể loại: Chọn "Thể loại khác"</div>
          <hr />
          <div>Bước 3: Nhập thông tin liên hệ và cách thức nhận hàng</div>
          <hr />
          <div>
            Bước 4: Quan tâm Zalo Official Account để nhận thông báo về đơn
            hàng. Truy cập{' '}
            <a
              href='http://zalo.me/4013961016678131109?src=qr'
              target='_blank'
              rel='noreferrer'
            >
              Trung tâm dịch vụ sinh viên iStudent
            </a>{' '}
            và nhấn "Quan tâm"
          </div>
          <hr />
        </div>
        <h6>2. Hướng dẫn thanh toán</h6>
        <div>
          Sau khi nhận báo giá tại Zalo OA, vui lòng chuyển khoản về tài khoản
          để xác nhận in tự động:
        </div>
        <div>- Ngân hàng quân đội MB</div>
        <div>- Chủ tài khoản: NGUYEN NGOC HUAN</div>
        <div>- Số tài khoản: 7899996886</div>
        <div>- Nội dung: [Mã đơn hàng] [dấu cách] [Họ tên không dấu] </div>
      </Modal.Body>
    </Modal>
  )
}

export default InstructionModal
