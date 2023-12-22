import React, { useState, useEffect } from "react";
import styles from "./drivingDate.module.css";

import DrivingApi from "api/drivingApi";
import { Button, FormControl } from "react-bootstrap";
import { toastWrapper } from "utils";
import { toast } from "react-toastify";

function DrivingByDate() {
  const [dates, setDates] = useState([]);
  const [drivingDate, setDrivingDate] = useState(null);
  const [drivingTime, setDrivingTime] = useState("buổi sáng");
  const [description, setDescription] = useState("");
  console.log(description)

  useEffect(() => {
    let today = new Date();
    today = today.toISOString().split("T")[0];
    setDrivingDate(today);

    DrivingApi.getAllDrivingsDate()
      .then((res) => {
        const temp = res.data;

        for (let e of temp) {
          e.date = new Date(e.date);
        }

        setDates(temp);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleVisibleButton = (_id, date, isVisible, formVisible = false) => {
    DrivingApi.handleVisibleButton(_id, date, isVisible, formVisible)
      .then((res) => {
        DrivingApi.getAllDrivingsDate()
          .then((res) => {
            const temp = res.data;

            for (let e of temp) {
              e.date = new Date(e.date);
            }

            setDates(temp);
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert("Vui lòng liên hệ quản trị để cập nhật");
      });
  };

  const handleAddDateButton = () => {
    DrivingApi.handleAddDateButton(drivingDate, true, description)
      .then((res) => {
        DrivingApi.getAllDrivingsDate()
          .then((res) => {
            const temp = res.data;

            for (let e of temp) {
              e.date = new Date(e.date);
            }

            setDates(temp);
            toastWrapper("Thêm ngày thành công", "success");
          })
          .catch((error) => {
            toastWrapper(error, "error");
          });
      })
      .catch((error) => {
        alert("Vui lòng liên hệ quản trị để thêm ngày");
      });
  };

  const handleDateChange = (e) => {
    let date = new Date(`${e.target.value} 12:00:00`);
    setDrivingDate(date);
  };

  const handleTimeChange = (e) => {
    console.log(e.target.value);
    setDrivingTime(e.target.value);
  };

  return (
    <div>
      <div className='d-flex flex-column align-items-center m-5'>
        <FormControl
          className="mb-3"
          type="date"
          id="start"
          name="trip-start"
          defaultValue={drivingDate}
          onChange={handleDateChange}
        />
        <FormControl className="mb-3" as='textarea' placeholder="Mô tả" onChange={(e) => setDescription(e.target.value)} />
        <Button
          variant="outline-primary"
          onClick={() => handleAddDateButton()}
        >
          Thêm ngày
        </Button>
      </div>
      <div>
        {dates.map((child, index) => {
          return (
            <div className={styles.dateContainer}>
              <span>{child.date.toLocaleDateString()}</span>
              <button
                onClick={() => {
                  handleVisibleButton(
                    child._id,
                    child.date,
                    true,
                    child.formVisible
                  );
                }}
                className={styles.dateButton}
                style={
                  child.isVisible
                    ? { backgroundColor: "var(--primary)", color: "white" }
                    : null
                }
              >
                Hiện
              </button>
              <button
                onClick={() => {
                  handleVisibleButton(
                    child._id,
                    child.date,
                    false,
                    child.formVisible
                  );
                }}
                className={styles.dateButton}
                style={
                  child.isVisible
                    ? null
                    : { backgroundColor: "var(--primary)", color: "white" }
                }
              >
                Ẩn
              </button>
              <button
                onClick={() => {
                  handleVisibleButton(
                    child._id,
                    child.date,
                    child.isVisible,
                    !child.formVisible
                  );
                }}
                className={styles.dateButton}
                style={
                  child.formVisible
                    ? { backgroundColor: "var(--primary)", color: "white" }
                    : null
                }
              >
                Hiện trên website
              </button>
            </div>
          );
        })}
      </div>
      <div>{dates.length <= 0 ? "Không có dữ liệu" : null}</div>
    </div>
  );
}

export default DrivingByDate;
