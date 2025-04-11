import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import ZaloLink from "components/link/ZaloLink";
import DrivingApi from "api/drivingApi";
import AccountModal from "../components/AccountModal";
import { Button } from "react-bootstrap";

export default function DrivingInstructionPage(props) {
  const MAP_URL ='https://maps.app.goo.gl/kyq58xK5b8p4rEi1A';
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get("s");
  const navigate = useNavigate();
  const [accountShow, setAccountShow] = useState(false);
  const drivingInfo = JSON.parse(localStorage.getItem('driving-info') || '{}');

  return (
    <div>
      <div>
        <img
          src="/drivingbanner.jpg"
          alt="driving banner"
        />
        <div>
          <button
            onClick={() => {
              if (source) {
                navigate(`/driving-registration?s=${source}`);
              } else {
                navigate("/driving-registration");
              }
            }}
          >
            Đăng ký
          </button>

          <a
            href={`https://zalo.me/${ZALO_OA_NUMBER}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            Zalo OA
          </a>
        </div>
      </div>
      <div>
        <div>
          <h3>Xem nhanh</h3>
          <a href="#address">
            Địa điểm
          </a>
          <a href="#fee">
            Lệ phí thi
          </a>
          <a href="#date">
            Ngày thi
          </a>
          <a href="#online">
            Quy trình đăng ký online
          </a>
          <a href="#offline">
            Quy trình đăng ký trực tiếp
          </a>
          <a href="#fee-instruction">
            Hướng dẫn thanh toán lệ phí
          </a>
          <a href="#mocktest">
            Tài liệu lý thuyết và thi thử thực hành
          </a>
          <a href="#faq">
            Các câu hỏi thường gặp
          </a>
          <a href="#contact">
            Liên hệ hỗ trợ
          </a>
        </div>
        <div>
          <div id="address">
            <h3>Địa điểm dự thi</h3>
            <p>Thí sinh được chọn địa điểm thi khi điền link đăng ký.</p>
            <p className="my-2"><strong>Trường Đại học Thể dục Thể thao TP HCM</strong></p>
            <li>
              Địa chỉ: KP 6, P Linh Trung, TP Thủ Đức, TP HCM.
            </li>
            <li>Khám sức khoẻ tập trung tại Trường Đại học Thể dục Thể thao TP.HCM.</li>
            <li>Mượn xe số tập vòng số 8 tại nhà khách ĐHQG-HCM (miễn phí) và tập xe cảm biến trước ngày thi (20.000đ/2 vòng).</li>
            <li>Cách ký túc xá Khu B ~4.1 km, ký túc xá Khu A ~3.8 km.</li>
            <li>Xem bản đồ: <a href="https://maps.app.goo.gl/t3MdSZzysRQyA3fR9" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            <p className="my-2"><strong>Trung Tâm Kỹ Năng Thực Hành Cơ Giới GTVT Thuận An</strong></p>
            <p>
              <li>Địa chỉ: ĐT743A, P Bình Thắng, TP Dĩ An, Bình Dương.</li>
              <li>Khám sức khoẻ tập trung tại Nhà khách ĐHQG-HCM.</li>
              <li>Mượn xe số tập vòng số 8 tại nhà khách ĐHQG-HCM (miễn phí) và tập xe cảm biến trước ngày thi (miễn phí).</li>
              <li>Cách ký túc xá khu B ~3 km, ký túc xá Khu A ~4.2 km. Có xe đưa rước tại Kí túc xá Khu B vào ngày thi.</li>
              <li>Xem bản đồ: <a href="https://maps.app.goo.gl/fqtCLDRyLKf6Eo3u7" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            </p>
            <p className="my-2"><strong>Trung Tâm Sát Hạch Loại 3</strong></p>
            <p>
              <li>Địa chỉ: 21 Bis Đường số 9, P Trường Thọ, TP Thủ Đức, TP HCM.</li>
              <li>Khám sức khoẻ tập trung tại Nhà khách ĐHQG-HCM.</li>
              <li>Mượn xe số tập vòng số 8 tại nhà khách ĐHQG-HCM (miễn phí) và tập xe cảm biến trước ngày thi (30.000đ/2 vòng).</li>
              <li>Xem bản đồ: <a href="https://maps.app.goo.gl/eg89QWCSEwH2F8bQA" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            </p>
          </div>
          <div id="fee">
            <h3>Lệ phí thi</h3>
            <p>
              <strong>Gói A:</strong> 650.000đ đối với sinh viên. Không phải sinh viên, lệ phí là 690.000đ.
            </p>
            <p>
              Thí sinh tự chuẩn bị giấy khám sức khoẻ nộp về trung tâm, học viên vui lòng liên hệ trước khi đi khám để được hướng dẫn về chuẩn khám sức khoẻ hợp lệ. Đăng ký trực tiếp tại văn phòng Isinhvien. Vui lòng xem hướng dẫn tại mục ĐĂNG KÝ TRỰC TIẾP bên dưới.
            </p>
            <p>
              <strong>Gói B:</strong> 730.000đ đối với sinh viên. Không phải sinh viên, lệ phí là 770.000đ.
            </p>
            <p>
              Trung tâm hỗ trợ làm hồ sơ và khám sức khỏe tại trung tâm. Lệ phí thi đã bao gồm khám sức khoẻ, không phát sinh chi phí khi nhận bằng.
            </p>
          </div>
          <div id="date">
            <h3>Ngày thi</h3>
            <p>
              Thí sinh chọn ngày dự thi căn cứ theo lịch thi mỗi tháng trên link đăng ký <a href='/driving-registration' target="_blank" rel="noopener noreferrer">tại đây.</a>
            </p>
          </div>
          <div id="online">
            <h3>Hướng dẫn đăng ký online</h3>
            <p>1. Hoàn thành mẫu đơn đăng ký online bao gồm:</p>
            <ul>
              <li>Họ tên đầy đủ, có dấu.</li>
              <li>Số điện thoại liên hệ của bạn.</li>
              <li>Ảnh chụp 2 mặt chứng minh nhân dân/Căn cước công dân.</li>
              <li>
                Ảnh chụp chân dung để làm hồ sơ (ảnh chụp không quá 3 tháng, có thể tự chụp bằng điện thoại, nếu chụp ảnh thẻ cần xin file gốc đúng theo yêu cầu): Tóc
                không che trán, vén tóc ra sau mang tai, <b>LẤY ĐỦ 2 VAI, LẤY TỪ
                THẮT LƯNG TRỞ LÊN QUA ĐẦU</b>, không đeo kính, trang phục lịch sự,
                lấy nền tường/xanh. Vui lòng không sử dụng filter hay chỉnh sửa làm
                mất đặc điểm nhận dạng. Xem ảnh mẫu{" "}
                <a
                  href="https://i.imgur.com/pfjgD5m.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tại đây.
                </a>
              </li>
              <li>
                Ảnh chụp chân dung không đúng chuẩn sẽ làm ảnh hưởng đến quá trình xử lý hồ sơ của bạn.
              </li>
            </ul>
            <p id="fee-instruction">3. Thanh toán lệ phí</p>
            <ul>
              <li>Chuyển khoản ngân hàng</li>
              <Button className="my-3" variant='outline-primary' onClick={() => setAccountShow(true)}><small>Xem hướng dẫn chuyển khoản</small></Button>
              <li>
                Đóng trực tiếp: Tại văn phòng iSinhvien
                <br /> - Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương
                (Tầng trệt Nhà khách ĐHQG-HCM)
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 7 (14h00-17h00).
                <br /> - Mang theo CCCD để làm thủ tục.
                <br /> - Hotline: <ZaloLink tel={DRIVING_LICENSE_NUMBER}>0876 877 789</ZaloLink>
                <br/> - Zalo OA tư vấn và hỗ trợ: <ZaloLink tel={ZALO_OA_NUMBER}>Trung tâm dịch vụ sinh viên iStudent</ZaloLink>
                <br /> - Google maps:{" "}
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Văn phòng iSinhvien
                </a>
              </li>
              <li>Học viên đăng ký hoàn thành lệ phí thi trong vòng 24h từ khi đăng ký, hồ sơ sẽ được xử lý và cập nhật danh sách trên nhóm thi Zalo.</li>
            </ul>
            <p>4. Chờ duyệt hồ sơ:</p>
            <ul>
              <li>
                Sau khi đăng ký thành công, học viên sẽ nhận được đường link tham gia nhóm thi Zalo tại màn hình hoàn tất. Mọi thủ tục đăng ký dự thi cần hoàn tất trước ngày thi 15 ngày.
              </li>
              <li>
                Nếu không nhận được đường link tham gia nhóm thi Zalo, học viên vui lòng liên hệ Zalo OA:{" "}
                <ZaloLink tel={ZALO_OA_NUMBER}>
                  Trung tâm dịch vụ sinh viên iStudent
                </ZaloLink>{" "}
                để được hỗ trợ.
              </li>
              <li>Khung giờ phản hồi: 8h30-11h30, 13h30-17h00.</li>
            </ul>
            <p>5. Đi thi</p>
            <ul>
              <li>
                Danh sách dự thi và hướng dẫn dự thi sẽ được gửi đến thí sinh
                thông qua nhóm Zalo. Thí sinh vui lòng theo dõi để cập nhật
                thông tin mới nhất.
              </li>
              <li>
                Khi đi thi thí sinh cần mang theo căn
                cước công dân bản chính để đối chiếu.
              </li>
            </ul>
          </div>
          <div id="offline">
            <h3>Hướng dẫn đăng ký trực tiếp</h3>
            <ul>
              <li>
                Địa điểm: Tại văn phòng iSinhvien
                <br /> - Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương
                (Tầng trệt Nhà khách ĐHQG-HCM)
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 7 (14h00-17h00).
                <br /> - Mang theo CCCD để làm thủ tục.
                <br /> - Hotline: <ZaloLink tel={DRIVING_LICENSE_NUMBER}>0876 877 789</ZaloLink>
                <br/> - Zalo OA tư vấn và hỗ trợ: <ZaloLink tel={ZALO_OA_NUMBER}>Trung tâm dịch vụ sinh viên iStudent</ZaloLink>
                <br /> - Google maps:{" "}
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Văn phòng iSinhvien
                </a>
              </li>
              <li>
                Khi đến đăng ký, học viên cần đăng ký thông tin online trước hoặc trực tiếp tại văn phòng theo
                hướng dẫn ở trên.
              </li>
            </ul>
          </div>
          <div id="mocktest">
            <h3>
              {"Hướng dẫn ôn tập lý thuyết và thực hành"}
            </h3>
            <p>Học viên xem hướng dẫn ôn tập lý thuyết và thực hành <a rel="noreferrer noopener" target="_blank" href="https://www.langf.vn/cam-nang-lang-dai-hoc/thi-bang-lai-xe-lang-dai-hoc/#TAI_LIEU_ON_TAP_LY_THUYET_VA_THUC_HANH">tại đây.</a></p>
          </div>
        </div>

        <div id="faq">
          <h3>Các câu hỏi thường gặp</h3>
          <dl>
            <dt>Hỏi: Thời gian nhận bằng là bao lâu?</dt>
            <dd>
              Trả lời: 22 ngày làm việc kể từ ngày thi đậu, không bao gồm thứ Bảy,
              Chủ Nhật và ngày lễ.
            </dd>
            <dt>Hỏi: Học phí thanh toán ở đâu?</dt>
            <dd>
              Trả lời: Thanh toán online hoặc trực tiếp tại nhà khách ĐHQG-HCM.
            </dd>
            <dt>Hỏi: Có được tập xe cảm biến trước khi thi không?</dt>
            <dd>
              Trả lời: Được tập xe cảm biến giống với thi thật trước khi thi. Phí tập xe cảm biến do điểm thi quy định.
            </dd>
            <dt>Hỏi: Mình muốn tập vòng số 8 có thể tập ở đâu?</dt>
            <dd>
              Trả lời: Học viên có thể tập vòng số 8 tại cửa trước <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Văn phòng iSinhvien
                </a> - Nhà khách ĐHQG-HCM, ra vào tự do, không giới hạn khung giờ.
            </dd>

            <dt>Hỏi: Điểm đậu lý thuyết là bao nhiêu?</dt>
            <dd>Trả lời: 21/25 câu hỏi và không được sai câu điểm liệt.</dd>
          </dl>
        </div>
        <div>
          <p id="contact">
            Để được hỗ trợ thêm, vui lòng liên hệ Zalo OA:{" "}
            <ZaloLink tel={ZALO_OA_NUMBER}>
              Trung tâm dịch vụ sinh viên iStudent
            </ZaloLink>
            {' '}hoặc hotline <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
              0876 877 789
            </ZaloLink> (Zalo/Di động).
          </p>
        </div>
      </div>
    <AccountModal show={accountShow} setShow={setAccountShow} amount={730000} tel={drivingInfo?.tel}/>
    </div>

  );
}
