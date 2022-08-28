import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastWrapper } from 'utils';
import { BsCloudUpload } from 'react-icons/bs'
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import axiosClient from 'api/axiosClient';

function FileUploader(props) {
  const FILE_MAX_SIZE = 50 * 1024 * 1024;
  const [uploadPercent, setUploadPercent] = useState(false);

  const onDropAccepted = useCallback((files) => {
    props?.setUploading(true);
    let formData = new FormData();
    formData.append(props?.name, files[0]);
    axiosClient
      .post(props?.url, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = parseInt(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadPercent(percent / 2);

          if (percent === 100) {
            setTimeout(() => {
              setUploadPercent(75);
            }, 1500);
          }
        },
      })
      .then((res) => {
        console.log(res)
        props?.setFileId(res?.data?.fileId);
        props?.setFileName(files?.[0]?.name);
        setUploadPercent(100);
        props?.setUploading(false);
      })
      .catch((err) => {
        props?.setUploading(false);
        ToastWrapper(err?.response?.data?.message, 'error');
      });
  }, []);

  const onDropRejected = (file) => {
  };

  const fileSizeValidator = (file) => {
    if (file.size > FILE_MAX_SIZE) {
      return {
        code: 'file-too-large',
        message: `Kích thước tệp không được vượt quá ${
          FILE_MAX_SIZE / 1024 / 1024
        }M`,
      };
    }

    return null;
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    validator: fileSizeValidator,
  });
  return (
    <Styles>
      <Form.Label className='mb-3'>{props?.label || props?.children || ''}</Form.Label>
      <button type='button' {...getRootProps()} className='btn d-flex flex-column align-items-center' disabled={props?.uploading}>
        <input {...getInputProps()} />
        <div className={`upload-button d-flex align-items-center justify-content-center px-3 py-2 btn btn-success`}>
          <BsCloudUpload size={25}/>
          <p className='ms-2'>{props?.text || 'Thêm tệp'}</p>
        </div>
        {props?.uploading && <p className='form-text my-2 text-center'>Đang tải {uploadPercent}%</p>}
        {fileRejections?.[0]?.errors?.map((error) => {
          return <p key={error?.code} className='my-2 text-center text-danger'>{error?.message}</p>
        })}
      </button>
    </Styles>
  )
}

export default FileUploader;

const Styles = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .upload-button {
    width: fit-content;
    margin: 0 auto;

    p {
      margin: 0;
    }
  }
`