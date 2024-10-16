import React, { useEffect, useState } from "react";
import { authHeader } from "../../../utils";
import Driving from "./Driving";

import DrivingApi from "api/drivingApi";

function A2Driving() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    DrivingApi.getDrivingByType(1)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.toString());
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? <p>Đang tải dữ liệu...</p> : null}
      {data.length <= 0 ? <p>Không có dữ liệu</p> : null}
      <>
        {data.map((child) => {
          return <Driving info={child} key={child._id} id={child._id} />;
        })}
      </>
    </>
  );
}

export default A2Driving;
