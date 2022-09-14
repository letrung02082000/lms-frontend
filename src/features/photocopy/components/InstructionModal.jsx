import React from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function InstructionModal({ onConfirm, hideModal, data }) {
  return (
    <Modal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Hướng dẫn in</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>1. Quy trình in chỉ trong 2 giờ</h6>
        <div>
          <div>
            B1: Tải tệp cần in lên (có thể lần lượt tải lên nhiều tệp)
            <br />
            Hoặc chia sẻ liên kết đến tài liệu (nên chia sẻ link Google Drive và
            cần cho phép xem tài liệu công khai).
            <br />
            <a
              target={'_blank'}
              rel='noreferrer'
              href='https://www.thegioididong.com/game-app/cach-chia-se-file-tren-google-drive-bang-may-tinh-don-gian-1266542'
            >
              Xem hướng dẫn chia sẻ link Google Drive
            </a>
          </div>
          <div>B2: Nhập hướng dẫn in cho nhân viên</div>
          <div>- Khổ in: A3, A4, A5,...</div>
          <div>- Quy cách in: 1 mặt, 2 mặt, in màu, trắng đen,...</div>
          <div>- Quy cách in: 1 mặt, 2 mặt, in màu, trắng đen,...</div>
          <div>B3: Nhập thông tin liên hệ và cách thực nhận hàng</div>
          <div>B4: Phần thể loại: Chọn "Thể loại khác"</div>
          <div>
            B5: Quan trọng: Quan tâm Zalo Official Account để nhận thông báo về
            đơn hàng tại:{' '}
            <a
              href='http://zalo.me/4013961016678131109?src=qr'
              target='_blank'
              rel='noreferrer'
            >
              Trung tâm dịch vụ sinh viên iStudent
            </a><br/>Chọn "Quan tâm", sau đó chọn dịch vụ "In ấn".
          </div>
        </div>
        <h6>2. Hướng dẫn thanh toán</h6>
        <div>Sau khi nhận báo giá tại Zalo OA, vui lòng chuyển khoản về để xác nhận in:</div>
        <div>- Ngân hàng quân đội MB</div>
        <div>- Chủ tài khoản: NGUYEN NGOC HUAN</div>
        <div>- Số tài khoản: 0877876877</div>
        <div>- Nội dung: [Mã đơn hàng] [dấu cách] [Họ tên không dấu] </div>
      </Modal.Body>
    </Modal>
  );
}

export default InstructionModal;
