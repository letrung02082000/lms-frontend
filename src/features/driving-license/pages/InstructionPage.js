import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./instructionPage.module.css";
import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import ZaloLink from "components/link/ZaloLink";
import DrivingApi from "api/drivingApi";
import AccountModal from "../components/AccountModal";
import { useMemo } from "react";
import { Button } from "react-bootstrap";

export default function DrivingInstructionPage(props) {
  const MAP_URL ='https://maps.app.goo.gl/tpTzL5rVsdCE8bc46?g_st=iz';
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get("s");
  const navigate = useNavigate();
  const [dateList, setDateList] = useState([]);
  const [accountShow, setAccountShow] = useState(false);
  const drivingInfo = JSON.parse(localStorage.getItem('driving-info') || '{}');

  const drivingDate = useMemo(()=>{
    if(drivingInfo?.date) {
      return new Date(drivingInfo?.date).toLocaleDateString('en-GB')
    } else return null;
  }, [drivingInfo?.date]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await DrivingApi.getFormVisible();
      let data = response.data;

      if (data.length > 0) {
        data = data.map((child) => {
          return {
            ...child,
            date: new Date(child.date),
          };
        });

        setDateList(data);
      } else {
        alert("Chưa có danh sách ngày thi mới");
      }
    };

    try {
      fetchData();
    } catch (e) {
      alert("Lỗi: " + e);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <img
          src="/drivingbanner.jpg"
          alt="driving banner"
          className={styles.drivingBanner}
        />
        <div className={styles.introContainerTop}>
          <button
            className={styles.contactButtonTop}
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
            className={styles.contactButtonTop}
            href={`https://zalo.me/${DRIVING_LICENSE_NUMBER}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            Zalo
          </a>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={styles.sectionTitle}>Xem nhanh</h3>
          <a className={styles.fastTitle} href="#address">
            Địa điểm
          </a>
          <a className={styles.fastTitle} href="#fee">
            Lệ phí thi
          </a>
          <a className={styles.fastTitle} href="#date">
            Ngày thi
          </a>
          <a className={styles.fastTitle} href="#online">
            Quy trình đăng ký online
          </a>
          <a className={styles.fastTitle} href="#offline">
            Quy trình đăng ký trực tiếp
          </a>
          <a className={styles.fastTitle} href="#fee-instruction">
            Hướng dẫn thanh toán lệ phí
          </a>
          <a className={styles.fastTitle} href="#mocktest">
            Tài liệu lý thuyết và thi thử thực hành
          </a>
          <a className={styles.fastTitle} href="#faq">
            Các câu hỏi thường gặp
          </a>
          <a className={styles.fastTitle} href="#contact">
            Liên hệ hỗ trợ
          </a>
        </div>
        <div className={styles.body}>
          <div id="address">
            <h3 className={styles.sectionTitle}>Địa điểm dự thi</h3>
            <p>Thí sinh được chọn địa điểm thi khi điền link đăng ký.</p>
            <p className="my-2"><strong>Trung Tâm Sát Hạch Loại 3</strong></p>
            <p>
              <li>Địa chỉ: 23 Đường số 9, P Trường Thọ, TP Thủ Đức, TP HCM.</li>
              <li>Khám sức khoẻ tập trung tại điểm thi.</li>
              <li>Xem bản đồ: <a href="https://maps.app.goo.gl/eg89QWCSEwH2F8bQA" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            </p>
          </div>
          <div id="fee">
            <h3 className={styles.sectionTitle}>Lệ phí thi</h3>
            <p>
              <strong>Gói A:</strong> 640.000đ.
            </p>
            <p>
              Thí sinh tự chuẩn bị giấy khám sức khoẻ nộp về trung tâm, học viên vui lòng liên hệ trước khi đi khám để được hướng dẫn về chuẩn khám sức khoẻ hợp lệ. Đăng ký trực tiếp tại văn phòng Bách Việt. Vui lòng xem hướng dẫn tại mục ĐĂNG KÝ TRỰC TIẾP bên dưới.
            </p>
            <p>
              <strong>Gói B:</strong> 740.000đ đối với sinh viên. Không phải sinh viên, lệ phí là 760.000đ.
            </p>
            <p>
              Trung tâm hỗ trợ làm hồ sơ và khám sức khỏe tại trung tâm. Lệ phí thi đã bao gồm khám sức khoẻ, không phát sinh chi phí khi nhận bằng.
            </p>
          </div>
          <div id="date">
            <h3 className={styles.sectionTitle}>Ngày thi</h3>
            <p>
              Học viên chọn ngày dự thi căn cứ theo lịch thi mỗi tháng như sau:
            </p>
            <ul>
              {dateList &&
                dateList.map((child) => {
                  return <li key={child._id}>{child.description}</li>;
                })}
            </ul>
          </div>
          <div id="online">
            <h3 className={styles.sectionTitle}>Hướng dẫn đăng ký online</h3>
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
                Đóng trực tiếp: Tại văn phòng Bách Việt
                <br /> - Địa chỉ: 36 Đường số 6, Phường Linh Trung, Tp Thủ Đức, Hồ Chí Minh.
                <br /> - Giờ làm việc: Từ Thứ Hai - Thứ Sáu (Sáng: 08:00-12:00, Chiều: 13:30-17:00), Thứ bảy (08:00-12:00).
                <br /> - Mang theo CCCD để làm thủ tục.
                <br /> - Hotline: <ZaloLink tel={DRIVING_LICENSE_NUMBER}>0963 868 632</ZaloLink>
                <br /> - Google maps:{" "}
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Văn phòng Bách Việt
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
                Nếu không nhận được đường link tham gia nhóm thi Zalo, học viên vui lòng liên hệ Zalo:{" "}
                <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
                  Trung tâm đào tạo lái xe Bách Việt
                </ZaloLink>{" "}
                để được hỗ trợ.
              </li>
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
            <h3 className={styles.sectionTitle}>Hướng dẫn đăng ký trực tiếp</h3>
            <ul>
              <li>
                Địa điểm: Tại văn phòng Bách Việt
                <br /> - Địa chỉ: 36 Đường số 6, Phường Linh Trung, Tp Thủ Đức, Hồ Chí Minh.
                <br /> - Giờ làm việc: Từ Thứ Hai - Thứ Sáu (Sáng: 08:00-12:00, Chiều: 13:30-17:00), Thứ bảy (08:00-12:00).
                <br /> - Mang theo CCCD để làm thủ tục.
                <br /> - Hotline: <ZaloLink tel={DRIVING_LICENSE_NUMBER}>0963 868 632</ZaloLink>
                <br /> - Google maps:{" "}
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Văn phòng Bách Việt
                </a>
              </li>
              <li>
                Khi đến đăng ký, học viên cần đăng ký thông tin online trước hoặc trực tiếp tại văn phòng theo
                hướng dẫn ở trên.
              </li>
            </ul>
          </div>
          <div id="mocktest">
            <h3 className={styles.sectionTitle}>
              {"Hướng dẫn ôn tập lý thuyết và thực hành"}
            </h3>
            <p>Học viên xem hướng dẫn ôn tập lý thuyết và thực hành <a rel="noreferrer noopener" target="_blank" href="https://heyzine.com/flip-book/11e1158548.html">tại đây.</a></p>
          </div>
        </div>

        <div id="faq">
          <h3 className={styles.sectionTitle}>Các câu hỏi thường gặp</h3>
          <dl className={styles.faqContainer}>
            <dt>Hỏi: Thời gian nhận bằng là bao lâu?</dt>
            <dd>
              Trả lời: 22 ngày làm việc kể từ ngày thi đậu, không bao gồm thứ Bảy,
              Chủ Nhật và ngày lễ.
            </dd>
            <dt>Hỏi: Học phí thanh toán ở đâu?</dt>
            <dd>
              Trả lời: Thanh toán online hoặc trực tiếp tại văn phòng.
            </dd>
            <dt>Hỏi: Có được tập xe cảm biến trước khi thi không?</dt>
            <dd>
              Trả lời: Được tập xe cảm biến giống với thi thật trước khi thi. Phí tập xe cảm biến do điểm thi quy định.
            </dd>
            <dt>Hỏi: Điểm đậu lý thuyết là bao nhiêu?</dt>
            <dd>Trả lời: 21/25 câu hỏi và không được sai câu điểm liệt.</dd>
          </dl>
        </div>
        <div className={styles.footer}>
          <p id="contact">
            Để được hỗ trợ thêm, vui lòng liên hệ hotline <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
            0963 868 632
            </ZaloLink> (Zalo/Di động).
          </p>
        </div>
      </div>
    <AccountModal show={accountShow} setShow={setAccountShow} amount={740000} tel={drivingInfo?.tel}/>
    </div>

  );
}
