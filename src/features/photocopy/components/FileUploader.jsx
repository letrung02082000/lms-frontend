import axiosClient from 'api/axiosClient';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastWrapper } from 'utils';

function FileUploader() {
  const FILE_MAX_SIZE = 50 * 1024 * 1024;
  const [fileIds, setFileIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(false);

  const onDropAccepted = useCallback((files) => {
    setUploading(true);
    let formData = new FormData();
    formData.append('document', files[0]);
    axios
      .post('http://localhost:5001/api/orders/upload', formData, {
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
        setFileIds((prev) => [...prev, res.data.documentId]);
        setUploadPercent(100);
        setUploading(false);
      })
      .catch((err) => {
        setUploading(false);
        ToastWrapper(err.response.data.message, 'error');
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

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    validator: fileSizeValidator,
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Tải tệp lên</p>
      {fileRejections?.[0]?.errors?.map((error) => {
        return <p key={error?.code}>{error?.message}</p>;
      })}
      {acceptedFiles?.[0]?.name}
    </div>
  );
}

export default FileUploader;
