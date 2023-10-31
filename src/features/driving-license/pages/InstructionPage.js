import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./instructionPage.module.css";

import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import ZaloLink from "components/link/ZaloLink";
import { convertPhoneNumber } from "utils";

import DrivingApi from "api/drivingApi";
import AccountModal from "../components/AccountModal";
import { useMemo } from "react";
import { Button } from "react-bootstrap";

export default function DrivingInstructionPage(props) {
  const MAP_URL ='https://maps.app.goo.gl/kyq58xK5b8p4rEi1A';
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
      {/* <TitleBar title="Hướng dẫn dự thi" navigation="driving-test" /> */}
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
            href={`https://zalo.me/${ZALO_OA_NUMBER}`}
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
            <p className="my-2"><strong>Trường Đại học Thể dục Thể thao TP HCM</strong></p>
            <li>
              Địa chỉ: KP 6, P Linh Trung, TP Thủ Đức, TP HCM.
            </li>
            <li>Khám sức khoẻ tập trung tại Trường Đại học Thể dục Thể thao TP.HCM.</li>
            <li>Tập xe cảm biến trước ngày thi. Phí tập xe: 20.000đ/2 vòng.</li>
            <li>Tập vòng số 8 tại Nhà khách ĐHQG-HCM.</li>
            <li>Cách ký túc xá Khu B 4.1 km, ký túc xá Khu A 3.8 km.</li>
            <li>Xem bản đồ: <a href="https://maps.app.goo.gl/t3MdSZzysRQyA3fR9" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            <p className="my-2"><strong>Trung Tâm Kỹ Năng Thực Hành Cơ Giới GTVT Thuận An</strong></p>
            <p>
              <li>Địa chỉ: ĐT743A, P Bình Thắng, TP Dĩ An, Bình Dương.</li>
              <li>Khám sức khoẻ tập trung tại Nhà khách ĐHQG-HCM.</li>
              <li>Tập xe cảm biến trước ngày thi miễn phí.</li>
              <li>Tập vòng số 8 tại Nhà khách ĐHQG-HCM. Mượn xe số miễn phí.</li>
              <li>Cách ký túc xá khu B 3.8 km, ký túc xá Khu A 4.2 km. Có xe đưa rước tại Kí túc xá Khu B.</li>
              <li>Xem bản đồ: <a href="https://maps.app.goo.gl/t3MdSZzysRQyA3fR9" rel="noopenner noreferer" target="_blank">Mở Google Maps.</a></li>
            </p>
          </div>
          <div id="fee">
            <h3 className={styles.sectionTitle}>Lệ phí thi</h3>
            <p>
              <strong>Gói A:</strong> 650.000đ đối với sinh viên. Không phải sinh viên, lệ phí là 690.000đ.
            </p>
            <p>
              Thí sinh tự chuẩn bị: Giấy khám sức khỏe tại các
              bệnh viện tuyến huyện trở lên. Thời gian có hiệu lực của giấy khám sức khỏe là 06 tháng. Đăng ký trực tiếp tại nhà
              khách ĐHQG-HCM, học viên có thể đóng lệ phí trực tiếp hoặc chuyển khoản. Vui lòng xem hướng dẫn đăng ký trực tiếp tại mục ĐĂNG KÝ TRỰC TIẾP bên dưới.
            </p>
            <p>
              <strong>Gói B:</strong> 690.000đ đối với sinh viên. Không phải sinh viên, lệ phí là 720.000đ.
            </p>
            <p>
              Trung tâm hỗ trợ làm hồ sơ và khám sức khỏe tại trung tâm. Đăng
              ký hoàn toàn online, có thể đóng lệ phí trực tiếp hoặc chuyển
              khoản.
            </p>
          </div>
          <div id="date">
            <h3 className={styles.sectionTitle}>Ngày thi</h3>
            <p>
              Thí sinh chọn ngày dự thi căn cứ theo lịch thi mỗi tháng như sau:
            </p>
            <ul>
              {dateList &&
                dateList.map((child) => {
                  return <li key={child._id}>{child.description}</li>;
                })}
            </ul>
            <p>Thí sinh được phép thay đổi ngày dự thi trước ngày thi chính thức 15 ngày.</p>
          </div>
          <div id="online">
            <h3 className={styles.sectionTitle}>Hướng dẫn đăng ký online</h3>
            <p>1. Hoàn thành mẫu đơn đăng ký online bao gồm:</p>
            <ul>
              <li>Họ tên đầy đủ, có dấu.</li>
              <li>Số điện thoại liên hệ của bạn.</li>
              <li>Ảnh chụp 2 mặt chứng minh nhân dân/Căn cước công dân.</li>
              <li>
                Ảnh chụp chân dung để làm hồ sơ và in trên bằng lái (ảnh tự chụp
                bằng điện thoại, không quá 3 tháng, nếu chụp ảnh thẻ cần xin file gốc đúng theo yêu cầu): Tóc
                không che trán, vén tóc ra sau mang tai, <b>LẤY ĐỦ 2 VAI, LẤY TỪ
                THẮT LƯNG TRỞ LÊN QUA ĐẦU</b>, không đeo kính, trang phục lịch sự,
                lấy nền tường. Vui lòng không sử dụng filter hay chỉnh sửa làm
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
            <p>3. Thanh toán lệ phí</p>
            <ul>
              <li>Chuyển khoản ngân hàng</li>
              <Button className="my-3" variant='outline-primary' onClick={() => setAccountShow(true)}>Xem hướng dẫn chuyển khoản</Button>

              <li>
                Đóng trực tiếp: Tại văn phòng iSinhvien
                <br /> - Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương
                (Tầng trệt Nhà khách ĐHQG)
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 7 (14h00-17h00).
                <br /> - Mang theo CMND/CCCD để làm thủ tục.
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
              <li>Hoàn thành lệ phí thi trước ngày dự thi 15 ngày.</li>
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
                Khi đi thi thí sinh cần mang theo chứng minh nhân dân hoặc căn
                cước công dân bản gốc để đối chiếu.
              </li>
              <li>
                Thí sinh được phép thay đổi ngày dự thi trước ngày thi chính thức 15 ngày.
              </li>
            </ul>
          </div>
          <div id="offline">
            <h3 className={styles.sectionTitle}>Hướng dẫn đăng ký trực tiếp</h3>
            <ul>
              <li>
                Địa điểm: Tại văn phòng iSinhvien
                <br /> - Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương
                (Tầng trệt Nhà khách ĐHQG)
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 7 (14h00-17h00).
                <br /> - Mang theo CMND/CCCD để làm thủ tục.
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
                Khi đến đăng ký trực tiếp, học viên cần phải đăng ký thông tin online theo
                hướng dẫn ở trên.
              </li>
            </ul>
          </div>
          <div id="mocktest">
            <h3 className={styles.sectionTitle}>
              {"Thi thử thực hành & Tài liệu lý thuyết"}
            </h3>
            <p>Thực hành:</p>
            <ul>
              <li>6h30 - 7h30 đối với ngày thi sáng.</li>
              <li>10h30 - 12h00 đối với ngày thi chiều.</li>
              <li>Ngày thi thử: cùng ngày với ngày thi chính thức.</li>
            </ul>
            <p>
              Lý thuyết: Thí sinh tải tài liệu học lý thuyết{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/drive/folders/19vo_poKKXdz-tP_ZIgKdGFOwNNYMCxHZ"
              >
                tại đây.
              </a>
            </p>
          </div>
        </div>

        <div id="faq">
          <h3 className={styles.sectionTitle}>Các câu hỏi thường gặp</h3>
          <dl className={styles.faqContainer}>
            <dt>Hỏi: Thời gian nhận bằng là bao lâu?</dt>
            <dd>
              Trả lời: 22 ngày làm việc kể từ ngày thi đậu, không bao gồm thứ 7,
              chủ nhật và ngày lễ.
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
        <div className={styles.footer}>
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
    <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} amount={690000} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' desc={`GPLX ${drivingInfo?.tel || '<Số điện thoại>'} ${drivingDate || '<Ngày dự thi>'}`} />
    </div>

  );
}
