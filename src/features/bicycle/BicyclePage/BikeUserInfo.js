import React, { useEffect, useState } from "react";
import Loading from "../../../shared/Loading";

import "./bikeUserInfo.css";

import AccountApi from "api/accountApi";

function BikeUserInfo() {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    AccountApi.getUserCard()
      .then((res) => {
        var image = new Image();
        image.src = `data:image/png;base64,${res.data}`;
        document
          .getElementsByClassName("id-card-container")[0]
          .appendChild(image);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(
          "Vui lòng cập nhật giấy tờ tùy thân để sử dụng tính năng này"
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="id-card-container">
      {loading ? <Loading /> : null}
      <p style={{ textAlign: "center" }}>{errMsg}</p>
    </div>
  );
}

export default BikeUserInfo;
