import React from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import ZaloLink from 'components/link/ZaloLink';

function InstructionModal({ show, setShow }) {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Hướng dẫn đặt in online</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <div className='fw-bold text-danger mb-2'>Hotline hỗ trợ</div>
          <ul>
            <li>
              <span>Zalo OA: </span>
              <a
                href='https://zalo.me/4013961016678131109'
                target='_blank'
                rel='noreferrer'
              >
                Trung tâm dịch vụ sinh viên
              </a>
            </li>
            <li>
              Di động/Zalo: <ZaloLink tel='0876877789'>0876 877 789</ZaloLink>{' '}
              (Mr. Trung)
            </li>
          </ul>
        </div>
        <div className='mb-3'>
          <h6 className='fw-bold text-danger mb-2'>Cách thức giao hàng</h6>
          <p className='mb-0'>Giao hàng miễn phí trong bán kính 5km, ngoài bán kính 5km thu phí theo thoả thuận.</p>
          <ul>
            <li>Các ngày trong tuần</li>
            <li>Buổi sáng: 6g00 - 8g00</li>
            <li>Buổi chiều: 17g00 - 19g00</li>
            <li>Giao nhanh 30 phút trong bán kính 5km đối với đơn hàng có giá trị trên 100.000đ</li>
          </ul>
        </div>
        <h6 className='fw-bold text-danger mb-2'>Hướng dẫn gửi tài liệu</h6>
        <div>
          <div>
            <b>Bước 1.</b>
            <div>- Tải tệp cần in lên</div>
            <div>- Hoặc chia sẻ liên kết đến tài liệu. </div>
            <div>
              <a
                target={'_blank'}
                rel='noreferrer'
                href='https://www.thegioididong.com/game-app/cach-chia-se-file-tren-google-drive-bang-may-tinh-don-gian-1266542'
              >
                Xem hướng dẫn chia sẻ link Google Drive
              </a>
            </div>
          </div>
          <hr />
          <div><b>Bước 2.</b> Nhập hướng dẫn in cho nhân viên</div>
          <div>
            - Chọn thể loại và thẻ in: Chọn "Thể loại khác" nếu cần nhân viên hỗ
            trợ tư vấn thêm qua Zalo.
          </div>
          <div>
            - Trả lời các câu hỏi gợi ý về khổ in, quy cách in, số lượng, loại
            giấy in,...
          </div>
          <hr />
          <div><b>Bước 3.</b> Nhập thông tin liên hệ và cách thức nhận hàng</div>
          <div>
            - Nhập số điện thoại liên hệ và Zalo để nhận báo giá đơn hàng của
            bạn.
          </div>
          <div>
            - Chọn hình thức giao hàng: Nhận tại cửa hàng hoặc giao hàng tận nơi.
           
          </div>
          <div>
          - Miễn phí giao hàng (bán kính dưới 5km) vào khung giờ cố định mỗi ngày hoặc giao hàng nhanh 30 phút đối với đơn hàng có giá trị trên 100.000đ.
          </div>
          <hr />
          <div><b>Bước 4.</b> Nhận báo giá và thanh toán đơn hàng</div>
          <div>
            - Sau khi nhận báo giá tại Zalo, vui lòng chuyển khoản trước 70% giá
            trị đơn hàng theo hướng dẫn để xác nhận in <b>TỰ ĐỘNG</b>.
            
          </div>
          <div>
          - Hướng dẫn thanh toán sẽ được gửi kèm báo giá.
          </div>
        </div>
        {/* <h6 className='fw-bold text-danger mb-2'>Thông tin thanh toán</h6>
        <Row>
          <Col>
            <div className='text-uppercase fw-bold'>Ngân hàng TMCP Công thương Việt Nam (Vietinbank)</div>
            <div>
              Chủ tài khoản
              <br />
              <b>LE VAN TRUNG</b>
            </div>
            <div>
              <Row>
                <Col xs={12}>
                  Số tài khoản
                  <br />
                  <b>10087 4488 636</b>
                </Col>
                <Col>
                  <Button
                    style={{
                      fontSize: '0.8rem'
                    }}
                    onClick={() => {
                      copyText('100874488636');
                      setCopied(true);
                    }}
                    variant='outline-primary'
                  >
                    {copied ? 'Đã chép' : 'Sao chép'}
                  </Button>
                </Col>
              </Row>
            </div>
            <div>
              Nội dung
              <br />
              <b>{`IN <mã đơn hàng>`}</b>
            </div>
            <div>
              Ví dụ
              <br />
              <b>{`IN 2211221`}</b>
            </div>
          </Col>
          <Col>
            <img src='vietqr.jpg' alt='vietqr' style={{ width: '100%' }} />
          </Col>
        </Row> */}
      </Modal.Body>
    </Modal>
  );
}

export default InstructionModal
