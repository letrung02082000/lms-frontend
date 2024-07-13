import React from 'react';
import ImagePlaceholder from 'assets/images/ImagePlaceholder';
import styled from 'styled-components';
import FileUploader from 'components/form/FileUploader';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';
import { MdDeleteOutline } from 'react-icons/md';
import Asterisk from 'components/form/Asterisk';

function UploadArea(props) {
  let baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const url = `${baseURL}/files`
  const MAX_QUANTITY = 5;
  const [fileUploading, setFileUploading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const onUploaded = (val) => {
    props?.setFileList((_prev) => {
      return [..._prev, val];
    });
  };
  
  const handleDeleteButton = (idx) => {
    if(idx === deleteId) {
      props.setFileList(_prev => {
        return [..._prev.slice(0, idx), ..._prev.slice(idx + 1)]
      })
      setDeleteId(null);
    } else {
      setDeleteId(idx);
    }
  }

  return (
    <Styles>
      <Row>
        <Col lg={8}>
          {props?.fileList.length === 0 && (
            <Row>
              <Col md={2} className='mb-3 d-none d-md-block'>
                <ImagePlaceholder />
              </Col>
              <Col>
                <div>
                  <Asterisk color='red'/>
                  <span> Hỗ trợ mọi định dạng</span>
                  <div><i>Tốt nhất: DOC; XLS; PPT; JPG; PNG; ZIP; RAR; PSD; EPS; AI; PDF</i></div>
                </div>
                <div>
                  <Asterisk color='red'/>
                  <span> Có thể tải lên nhiều tệp</span>
                  <div><i>Tối đa 5 tệp, kích thước 500MB/tệp</i></div>
                </div>
              </Col>
            </Row>
          )}
          {props?.fileList?.map((_item, _idx) => {
            return (
              <Row
                key={_item?.fileId}
                className='ms-2 my-3 text-success fw-bold'
              >
                <div className='d-flex'>
                  <div className='mt-1 file-text'>
                    {_idx + 1}
                    {'. '}
                    {_item?.fileName}
                  </div>
                  <Button
                    variant='outline-danger delete-btn ms-3'
                    onClick={() => handleDeleteButton(_idx)}
                  >
                    {_idx === deleteId ? (
                      <div className='delete-text'>Nhấn để xoá</div>
                    ) : (
                      <MdDeleteOutline color='#ed3e3e' />
                    )}
                  </Button>
                </div>
              </Row>
            );
          })}
        </Col>

        <Col>
          <FileUploader
            onUploaded={onUploaded}
            uploading={fileUploading}
            setUploading={setFileUploading}
            url={url}
            name='file'
            text={
              props?.fileList.length > 0 ? 'Thêm file khác' : 'Thêm tài liệu'
            }
            isDisabled={Boolean(props?.fileList.length >= MAX_QUANTITY)}
          />
          {props?.fileList.length >= MAX_QUANTITY && <div className='text-danger'>Đã đạt số lượng tải lên cho phép</div>}
        </Col>
      </Row>
    </Styles>
  );
}

export default UploadArea;

const Styles = styled.div`
  .delete-btn {
    min-width: fit-content;
    max-height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .delete-text {
    font-size: 0.7rem;
  }

  .file-text {
    overflow-wrap: anywhere;
  }
`;

UploadArea.propTypes = {
  fileList: PropTypes.array.isRequired,
  setFileList: PropTypes.func.isRequired,
};
