import React, { useEffect, useState } from "react";
import Driving from "./Driving";

import DrivingApi from "api/drivingApi";

function B2Driving() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    DrivingApi.getDrivingByType(2)
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

export default B2Driving;
