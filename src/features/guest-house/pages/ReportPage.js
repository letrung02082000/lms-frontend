import TitleBar from "components/TitleBar";
import { useEffect, useState } from "react";

import styles from "./reportPage.module.css";

import guesthouseApi from "api/guesthouseApi";
import { toastWrapper } from "utils";

export default function GuestHouseReportPage() {
  const [data, setData] = useState([]);
  const [roomSelected, setRoomSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    guesthouseApi.getRooms()
      .then((res) => {
        setData(res.data);
        if (res.data[0]) {
          setRoomSelected(res.data[0]);
        }
      })
      .catch((err) => {
        toastWrapper('Không thể lấy danh sách phòng', 'error')
      });
  }, []);

  const handleRoomChange = (e) => {
    setRoomSelected(e.target.value);
  };

  const handleSubmitButton = () => {
    const note = document.getElementById("formNote")?.value;

    if (!roomSelected) {
      return toastWrapper('Vui lòng chọn phòng của bạn', 'error')
    }

    if (!note) {
      return toastWrapper('Vui lòng nhập nội dung yêu cầu sửa chữa', 'error')
    }

    setLoading(true);

    guesthouseApi.postReportRoom({
      guestHouse: roomSelected,
      note,
    })
      .then((res) => {
        setLoading(false);
        toastWrapper('Gửi yêu cầu thành công', 'success')
        document.getElementById("formNote").value = '';

      })
      .catch((err) => {
        setLoading(false);
        toastWrapper('Gửi yêu cầu thất bại', 'error')
        document.getElementById("formNote").value = '';

      });
  };

  return (
    <div>
      <TitleBar title="Gửi yêu cầu sửa chữa" />
      <div className={styles.container}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Vui lòng chọn phòng của bạn
          </label>
          <select value={roomSelected} onChange={handleRoomChange}>
            {data.map((child) => {
              return (
                <option key={child._id} value={child._id}>
                  Phòng {child.number}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Yêu cầu</label>
          <textarea
            className={styles.formInput}
            placeholder="Nhập nội dung yêu cầu sửa chữa của bạn"
            rows={5}
            id="formNote"
          />
        </div>

        {loading ? (
          <span className={styles.formButton}>Đang gửi yêu cầu</span>
        ) : (
          <button className={styles.formButton} onClick={handleSubmitButton}>
            Gửi yêu cầu
          </button>
        )}
      </div>
    </div>
  );
}
