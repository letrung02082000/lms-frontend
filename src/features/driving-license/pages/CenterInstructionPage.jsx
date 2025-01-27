import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import styles from "./instructionPage.module.css";

import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import ZaloLink from "components/link/ZaloLink";
import { convertPhoneNumber, toastWrapper } from "utils";

import AccountModal from "../components/AccountModal";
import { useMemo } from "react";
import { Button } from "react-bootstrap";
import drivingApi from "api/drivingApi";

export default function CenterInstructionPage(props) {
  const MAP_URL ='https://maps.app.goo.gl/kyq58xK5b8p4rEi1A';
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get("s");
  const navigate = useNavigate();
  const [dateList, setDateList] = useState([]);
  const [accountShow, setAccountShow] = useState(false);
  const drivingInfo = JSON.parse(localStorage.getItem('driving-info') || '{}');

  const centerShortName = useParams().shortName;
  const [drivingCenter, setDrivingCenter] = useState({});
  useEffect(() => {
    drivingApi
      .query({ shortName: centerShortName })
      .then((res) => {
        document.title = res.data[0].name;
        setDrivingCenter(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const getDrivingDates = async (center) => {
      drivingApi
        .getFormVisible(center)
        .then((res) => {
          if (res?.data.length > 0) {
            let data = res?.data.map((child) => {
              return {
                ...child,
                date: new Date(child.date),
              };
            });

            setDateList(data);
          }
        })
        .catch((e) => {
          toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
        });
    };

    if (centerShortName) {
      drivingApi
        .queryDrivingCenters({ shortName: centerShortName })
        .then((res) => {
          if (res?.data?.length > 0) {
            const center = res?.data[0];
            document.title = center.name;
            setDrivingCenter(center);
            getDrivingDates(center?._id);
          }
        })
        .catch((e) => {
          toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
        });
    } else {
      getDrivingDates();
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
            href={`https://zalo.me/${ZALO_OA_NUMBER}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            Zalo OA
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
            <h3 className={styles.sectionTitle}>Lệ phí thi</h3>
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
        </div>
      </div>
    <AccountModal show={accountShow} setShow={setAccountShow} amount={730000} tel={drivingInfo?.tel}/>
    </div>

  );
}
