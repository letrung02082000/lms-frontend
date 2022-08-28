import photocopyApi from "api/photocopyApi";
import React from "react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import LazyImage from "shared/components/LazyImage";
import styled from "styled-components";
import SearchOrder from "./SearchOrder";

function SearchModal(props) {
  const photocopyInfo = JSON.parse(
    localStorage.getItem("photocopy-info") || "{}"
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    photocopyApi
      .searchOrder(e?.target?.term?.value)
      .then((res) => {
        setData(res?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const generateOrder = (data) => {
    if (data.length === 0) return <p>Không tìm thấy đơn hàng!</p>;
    return data?.map((order) => {
      return <SearchOrder key={order?.orderCode} {...order} />;
    });
  };
  console.log(data);
  return (
    <Modal show={props?.show} onHide={props?.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tra cứu đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Styles>
          <Form
            onSubmit={handleSubmit}
            className="placeholder-image my-2 d-flex justify-content-center flex-column align-items-center"
          >
            <Form.Control
              type="text"
              name="term"
              placeholder="Nhập số điện thoại đơn hàng"
              autoFocus
              defaultValue={photocopyInfo?.tel}
            />
            <Button
              className="mt-3 mb-5"
              type="submit"
              variant="primary"
              disabled={loading}
            >
              Tìm kiếm
            </Button>
            <div>
              {data === false && (
                <LazyImage
                  src="/document-search.jpg"
                  height={200}
                  width="auto"
                />
              )}
              {data !== false &&
                (loading ? (
                  <span>Đang tải dữ liệu...</span>
                ) : (
                  <div>{generateOrder(data)}</div>
                ))}
            </div>
          </Form>
        </Styles>
      </Modal.Body>
    </Modal>
  );
}

export default SearchModal;

const Styles = styled.div`
  .placeholder-image {
    img {
      border-radius: 15px;
    }
  }
`;
