import SearchBar from "components/SearchBar";
import TitleBar from "components/TitleBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./photocopyPage.module.css";

import PhotocopyApi from "api/photocopyApi";

function PhotocopyPage() {
  const navigate = useNavigate();
  const [photocopyList, setPhotocopyList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    PhotocopyApi.getPhotocopyList(limit, page)
      .then((res) => {
        if (res.data) {
          setPhotocopyList(res.data);
        }
      })
      .catch((err) => {
        alert(err.toString());
      });
  }, [page, limit]);

  const navigateTo = (url, data) => {
    navigate(url, { state: data });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      PhotocopyApi.queryPhotocopy({ tel: searchValue })
        .then((res) => {
          const data = res.data;

          if (data.length === 0) {
            alert(
              "Không tìm thấy đơn hàng khớp với số điện thoại " + searchValue
            );
          } else {
            console.log(data);
            setSearchData(data);
          }
        })
        .catch((e) => {
          console.log(e);
          alert(
            "Không tìm thấy đơn hàng khớp với số điện thoại " + searchValue
          );
        });
    }
  };

  return (
    <div className={styles.container}>
      <TitleBar title="In ấn" />
      {/* <div className={styles.imgContainer}>
        <img src='https://i.imgur.com/Wkn6m6d.png' alt='photocopy banner' />
      </div> */}
      <SearchBar
        placeholder="Tra cứu đơn hàng của bạn"
        focusText="Nhập số điện thoại của bạn và nhấn Enter"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleSearchPress}
      />
      {searchData &&
        searchData.map((child) => {
          const date = new Date(child.createdAt);
          let state = "";

          if (child.state === 0) {
            state = "Đang chờ xử lý";
          }

          return (
            <div className={styles.orderContainer} key={child._id}>
              <p>Mã đơn hàng: {child.orderCode || ""}</p>
              <p>Họ tên: {child.name}</p>
              <p>Ngày tạo: {date.toLocaleDateString("en-GB")}</p>
              <p>Trạng thái: {state}</p>
              <a
                href={child.documentLink}
                alt="document link"
                target="_blank"
                rel="noreferer noopener noreferrer"
              >
                Link tài liệu (admin)
                <br />
              </a>
              <a
                href={`https://drive.google.com/file/d/${child.receiptId}`}
                alt="receipt link"
                target="_blank"
                rel="noreferer noopener noreferrer"
              >
                Link hóa đơn (admin)
              </a>
              <p>Hướng dẫn in: {child.note}</p>
              <p>Địa chỉ giao hàng: {child.address}</p>
            </div>
          );
        })}
      <div className={styles.listContainer}>
        {photocopyList.map((child, idx, arr) => {
          return (
            <div key={child._id} className={styles.photocopyItemContainer}>
              <img src={child.images[0]} alt="logo" />
              <div className={styles.bodyContainer}>
                <p className={styles.photocopyName}>{child.name}</p>
                <p>{child.address}</p>
                <p>Di động: {child.tel}</p>
                <div className={styles.btnContainer}>
                  <button
                    onClick={() => navigateTo(`/photocopy?id=${child._id}`)}
                  >
                    Gửi tài liệu
                  </button>
                  {/* <button onClick={handleContactButton}>Liên hệ</button> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhotocopyPage;
