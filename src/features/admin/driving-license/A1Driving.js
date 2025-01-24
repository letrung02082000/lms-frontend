import React, { useState, useEffect } from "react";
import Driving from "./Driving";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import { updateDrivingData } from "../../../store/drivingAdminSlice";
import { useDispatch } from "react-redux";

import DrivingApi from "api/drivingApi";
import { Button } from "react-bootstrap";
import { DRIVING_STATE, DRIVING_STATE_LABEL } from "./constant";

function A1Driving() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [dateSelected, setDateSelected] = useState(null);
  const [state, setState] = useState(DRIVING_STATE.CREATED);
  const [image, setImage] = useState(null);
  const [isAll, setIsAll] = useState(false);
  const [count, setCount] = useState(0);

  const checkDuplicate = (data) => {
    const newData = data.map((child) => {
      let dup = 0;

      for (let element of data) {
        if (element.tel == child.tel) {
          ++dup;
        }
      }

      child.dup = dup;

      return child;
    });
    return newData;
  };

  useEffect(() => {
    dispatch(updateDrivingData(data));
  }, [data]);

  useEffect(() => {
    setLoading(true);
    DrivingApi
      .getDateVisible()
      .then(async (res) => {
        const temp = res.data;

        for (let e of temp) {
          e.date = new Date(e.date);
        }

        setDates(temp);

        if (temp[0]) {
          DrivingApi
            .queryDrivings(temp[0]?.date, DRIVING_STATE.CREATED)
            .then((res) => {
              const newData = checkDuplicate(res.data);
              setData(newData);
              setDateSelected(0);
              setLoading(false);
            })
            .catch((error) => {
              alert(error);
              setLoading(false);
            });
        }

        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }, []);

  const queryDrivings = async (dateIndex, state) => {
    if (dateIndex === null) {
      DrivingApi
        .queryDrivings(null, state)
        .then((res) => {
          const newData = checkDuplicate(res.data);
          setData(newData);
          setDateSelected(dateIndex);
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    } else {
      DrivingApi
        .queryDrivings(dates[dateIndex].date, state)
        .then((res) => {
          const newData = checkDuplicate(res.data);
          setData(newData);
          setDateSelected(dateIndex);
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }
  };

  const handleDateButton = async (index) => {
    setLoading(true);
    setIsAll(false);

    if (index === null) {
      await queryDrivings(null, state);
      return;
    }

    await queryDrivings(index, state);
    setDateSelected(index);
  };

  const handleStateButton = async (value) => {
    setIsAll(false);
    setLoading(true);
    setState(value);
    await queryDrivings(dateSelected, value);
  };

  const showImage = (image) => {
    setImage(image);
  };

  const hideImage = (image) => {
    setImage(null);
  };

  const countDrivings = async () => {
    DrivingApi
      .countDrivings(state)
      .then((res) => {
        setCount(res.data);
      })
      .catch((error) => {
        alert(error.toString());
      });
  };

  const getAllDrivings = async (state) => {
    DrivingApi
      .getAllDrivings(state)
      .then((res) => {
        const newData = checkDuplicate(res.data);
        setData(newData);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  const handleAllDatesButton = async () => {
    setLoading(true);
    setIsAll(true);
    setDateSelected(null);
    await queryDrivings(null, null);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        {dates.map((child, index) => {
          return (
            <Button
              variant={dateSelected === index ? "primary" : "text-secondary"}
              className="mx-2 my-1 rounded-pill border-primary px-2 py-1 form-label"
              onClick={() => handleDateButton(index)}
              key={child._id}
              style={{ width: '100px' }}
            >
              <span>{child.date.toLocaleDateString('en-GB')}</span>
            </Button>
          );
        })}
      </div>
      <div className='d-flex justify-content-center my-3'>
        <Button
          className="mx-2 form-label"
          onClick={() => handleStateButton(null)}
          variant={state === null ? 'primary' : 'outline-primary'}
        >
          Tất cả {state === null ? `(${data.length})` : ''}
        </Button>

        {Object.keys(DRIVING_STATE).map((key) => {
          return (
            <Button
              className="mx-2 form-label"
              onClick={() => handleStateButton(DRIVING_STATE[key])}
              variant={state === DRIVING_STATE[key] ? 'primary' : 'outline-secondary'}
              key={key}
            >
              {DRIVING_STATE_LABEL[DRIVING_STATE[key]]} {state === DRIVING_STATE[key] ? `(${data.length})` : ''}
            </Button>
          );
        })}
      </div>

      {data.length <= 0 && !loading && <p className="text-center mt-5">Không có dữ liệu</p>}

      {loading ? (
        <p className="text-center mt-5">Đang tải dữ liệu...</p>
      ) : (
        <div>
          {data.map((child) => {
            return (
              <Driving
                info={child}
                dateList={dates}
                key={child._id}
                id={child._id}
                showImage={showImage}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default A1Driving;
