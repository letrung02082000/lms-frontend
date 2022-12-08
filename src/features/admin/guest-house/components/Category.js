import React, { useEffect, useState } from "react";
import styles from "./category.module.css";

import GuesthouseApi from "api/guesthouseApi";

function Category() {
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selected === 0) {
      GuesthouseApi.getCategories(0, 25)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleAddButton = () => {
    const name = document.getElementById("formName").value;
    const description = document.getElementById("formDesc").value;

    if (!name) {
      return alert("Vui lòng nhập loại phòng");
    }

    GuesthouseApi.postCategory({ name, description })
      .then((res) => {
        return alert("Thêm thể loại thành công!");
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateButton = (id) => {
    const newName = document.getElementById(`formNewName_${id}`).value;
    const newDesc = document.getElementById(`formNewDesc_${id}`).value;

    if (!newName) {
      return alert("Vui lòng nhập loại phòng");
    }

    GuesthouseApi.patchCategory(id, { name: newName, description: newDesc })
      .then((res) => {
        console.log(res.data);
        return alert("Cập nhật thể loại thành công!");
      })
      .catch((err) => alert(err.toString()));
  };

  const toggleVisibleButton = (id, value) => {
    GuesthouseApi.patchCategory(id, { isVisible: value })
      .then(() => {
        GuesthouseApi.getCategories(0, 25)
          .then((res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => console.log(err));
        return alert("Cập nhật thành công!");
      })
      .catch((err) => alert(err.toString()));
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        {selected == 1 ? (
          <div className={styles.navItem} onClick={() => setSelected(0)}>
            <span>Tất cả thể loại</span>
          </div>
        ) : null}
        {selected == 0 ? (
          <div className={styles.navItem} onClick={() => setSelected(1)}>
            <span>Thêm thể loại</span>
          </div>
        ) : null}
      </div>
      {selected === 0 ? (
        <>
          {data.map((child, index) => {
            return (
              <div className={styles.itemContainer} key={child._id}>
                <textarea id={`formNewName_${child._id}`}>
                  {child.name}
                </textarea>
                <textarea id={`formNewDesc_${child._id}`}>
                  {child.description}
                </textarea>
                <div className={styles.buttonContainer}>
                  <button onClick={() => handleUpdateButton(child._id)}>
                    Cập nhật
                  </button>
                  {child.isVisible ? (
                    <button
                      onClick={() =>
                        toggleVisibleButton(child._id, !child.isVisible)
                      }
                    >
                      Ẩn
                    </button>
                  ) : (
                    <button
                      style={{
                        color: "red",
                        border: "1px solid red",
                        backgroundColor: "white",
                      }}
                      onClick={() =>
                        toggleVisibleButton(child._id, !child.isVisible)
                      }
                    >
                      Hiện
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
      {selected === 1 ? (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Loại phòng</label>
            <input className={styles.formInput} id="formName" type="text" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mô tả</label>
            <textarea className={styles.formInput} id="formDesc"></textarea>
          </div>
          <div className={styles.formGroup}>
            <button onClick={handleAddButton} className={styles.formButton}>
              Thêm
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Category;
