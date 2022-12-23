import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./instructionPage.module.css";

import { DRIVING_LICENSE_NUMBER } from "shared/constants/contact";
import ZaloLink from "shared/components/link/ZaloLink";
import { convertPhoneNumber } from "utils";

import DrivingApi from "api/drivingApi";
import AccountModal from "../components/AccountModal";
import { useMemo } from "react";
import { Button } from "react-bootstrap";

export default function DrivingInstructionPage(props) {
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
              if (source == 2) {
                navigate("/driving-registration?s=2");
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
            Hỗ trợ
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
            <p>Trường đại học thể dục thể thao TP.HCM.</p>
            <p>
              Địa chỉ: Khu phố 6, phường Linh Trung, thành phố Thủ Đức, thành
              phố Hồ Chí Minh (làng đại học, cạnh nhà điều hành ĐHQG).
            </p>
          </div>
          <div id="fee">
            <h3 className={styles.sectionTitle}>Lệ phí thi</h3>
            <p>
              <strong>Gói A:</strong> 600.000đ (giảm giá sinh viên còn
              550.000đ).
            </p>
            <p>
              Thí sinh tự chuẩn bị: 4 ảnh thẻ 3x4, giấy khám sức khỏe tại các
              bệnh viện tuyến huyện trở lên, 2 bản photo chứng minh nhân dân/căn
              cước công dân không cần công chứng. Đăng ký trực tiếp tại nhà
              khách ĐHQG, đóng lệ phí trực tiếp hoặc chuyển khoản.
            </p>
            <p>
              <strong>Gói B:</strong> 650.000đ (giảm giá sinh viên còn
              590.000đ).
            </p>
            <p>
              Trung tâm hỗ trợ làm hồ sơ và khám sức khỏe cùng ngày dự thi. Đăng
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
                bằng điện thoại, không quá 3 tháng, không chụp ảnh thẻ): Tóc
                không che trán, vén tóc ra sau mang tai, LẤY ĐỦ 2 VAI, LẤY TỪ
                THẮT LƯNG TRỞ LÊN QUA ĐẦU, không đeo kính, trang phục lịch sự,
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
                Ảnh chụp chân dung không đúng chuẩn sẽ làm chậm quá trình xử lý
                hồ sơ của bạn.
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
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 6 (14h00-17h00).
                <br /> - Mang theo CMND/CCCD để làm thủ tục.
                <br /> - Hotline: 0877.876.877
                <br /> - Google maps:{" "}
                <a
                  href="https://goo.gl/maps/mNj1KKJuJXFHLRsw8"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://goo.gl/maps/mNj1KKJuJXFHLRsw8
                </a>
              </li>
              <li>Hoàn thành lệ phí thi trước ngày dự thi 15 ngày.</li>
            </ul>
            <p style={{ color: "var(--primary)" }}>
              <strong>Cảnh báo:</strong> Thí sinh cảnh giác trước các hình thức
              mời chào làm hồ sơ tận nơi, giá rẻ hay mạo danh trung tâm yêu cầu
              chuyển tiền. Trung tâm không chịu trách nhiệm.
            </p>
            <p>4. Chờ duyệt hồ sơ:</p>
            <ul>
              <li>
                Sau khi đăng ký, trung tâm sẽ xác nhận lại trong vòng 1 ngày làm
                việc, mọi thủ tục cần hoàn tất trước ngày thi 15 ngày.
              </li>
              <li>
                Nếu bạn không nhận được thông báo, vui lòng liên hệ di
                động/Zalo:{" "}
                <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
                  {convertPhoneNumber(DRIVING_LICENSE_NUMBER, ".")}
                </ZaloLink>{" "}
                để được hỗ trợ.
              </li>
              <li>Khung giờ phản hồi: 8h30-11h30, 13h30-17h30.</li>
            </ul>
            <p>5. Đi thi</p>
            <ul>
              <li>
                Danh sách dự thi và hướng dẫn dự thi sẽ được gửi đến thí sinh
                thông qua nhóm Zalo . Thi sinh vui lòng theo dõi để cập nhật
                thông tin sớm nhất.
              </li>
              <li>
                Khi đi thi thí sinh cần mang theo chứng minh nhân dân hoặc căn
                cước công dân bản gốc để đối chiếu.
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
                <br /> - Giờ làm việc: Từ thứ 2 - thứ 6 (14h00-17h00).
                <br /> - Mang theo CMND/CCCD để làm thủ tục.
                <br /> - Hotline: 0877.876.877
                <br /> - Google maps:{" "}
                <a
                  href="https://goo.gl/maps/mNj1KKJuJXFHLRsw8"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://goo.gl/maps/mNj1KKJuJXFHLRsw8
                </a>
              </li>
              <li>
                Khi đăng ký trực tiếp, bạn vẫn cần phải đăng ký thông tin như
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
              <li>10h30 - 12h30 đối với ngày thi chiều.</li>
              <li>Ngày thi thử: cùng ngày với lịch thi chính thức.</li>
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
              Trả lời: Thanh toán online hoặc trực tiếp tại nhà khách ĐHQG.
            </dd>
            <dt>Hỏi: Có được lái thử trước khi thi không?</dt>
            <dd>
              Trả lời: Được lái thử với xe của trung tâm với phí 10k/vòng, địa
              điểm và thời gian được nêu ở trên.
            </dd>
            <dt>Hỏi: Mình muốn tập vòng số 8 có thể tập ở đâu?</dt>
            <dd>
              Trả lời: Cổng sau Trung tâm quốc phòng ĐHQG (miễn phí, bên ngoài,
              không vào trong trung tâm).
            </dd>

            <dt>Hỏi: Điểm đậu lý thuyết là bao nhiêu?</dt>
            <dd>Trả lời: 21/25 câu hỏi và không được sai câu điểm liệt.</dd>
          </dl>
        </div>
        <div className={styles.footer}>
          <p id="contact">
            Để được hỗ trợ thêm, vui lòng liên hệ Zalo:{" "}
            <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
              {convertPhoneNumber(DRIVING_LICENSE_NUMBER, ".")}
              <span> (Mr. Trung)</span>
            </ZaloLink>
          </p>
        </div>
      </div>
    <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} amount={590000} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' desc={`GPLX ${drivingInfo?.tel || '<Số điện thoại>'} ${drivingDate || '<Ngày dự thi>'}`} />
    </div>

  );
}
