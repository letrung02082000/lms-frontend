import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toastWrapper } from "utils";
import { BsCloudUpload } from "react-icons/bs";
import { Button, Form } from "react-bootstrap";
import axiosClient from "api/axiosClient";
import Asterisk from "./Asterisk";

function FileUploader({
  className,
  hasAsterisk,
  hasLabel = true,
  hasText = true,
  accept,
  multiple = false,
  ...props
}) {
  const FILE_MAX_SIZE = 10 * 1024 * 1024;
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const uploadFile = async (file) => {
    let formData = new FormData();
    const newFile = new File([file], file.name, { type: file.type });
    formData.append(props?.name, newFile);

    try {
      const response = await axiosClient.post(props?.url, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadPercent(percent / 2);
          if (percent === 100) {
            setTimeout(() => setUploadPercent(75), 1500);
          }
        },
      });
      return response;
    } catch (err) {
      toastWrapper(err?.response?.data?.message || "Không thể tải tệp lên", "error");
      throw err;
    }
  };

  const onDropAccepted = useCallback(
    async (files) => {
      setUploading(true);
      props?.setUploading?.(true);

      if (multiple) {
        for (const file of files) {
          try {
            setCurrentFile(file);
            const response = await uploadFile(file);
            props?.onResponse?.(response);
          } catch (err) {
            // Nếu có lỗi khi upload file nào đó, tiếp tục upload các file còn lại
            console.error("Upload error:", err);
          }
        }
      } else {
        try {
          const response = await uploadFile(files[0]);
          props?.onResponse?.(response);
        } catch (err) {
          console.error("Upload error:", err);
        }
      }

      setUploadPercent(100);
      setUploading(false);
      props?.setUploading?.(false);
    },
    [props?.url, props?.name, multiple]
  );

  const fileSizeValidator = (file) => {
    if (file.size > FILE_MAX_SIZE) {
      return {
        code: "file-too-large",
        message: `Kích thước tệp không được vượt quá ${FILE_MAX_SIZE / 1024 / 1024}MB`,
      };
    }
    return null;
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDropAccepted,
    multiple,
    validator: fileSizeValidator,
    ...(accept && { accept }),
  });

  return (
    <div className={className}>
      {hasLabel && (
        <>
          <Form.Label className='d-block'>
            {props?.label || props?.children}
            {hasAsterisk && <Asterisk />}
          </Form.Label>
          <Form.Text className='d-block mb-2'>{props?.subLabel}</Form.Text>
        </>
      )}

      <Button
        variant='outline-primary'
        className='d-block'
        {...getRootProps()}
        disabled={uploading}
      >
        <input {...getInputProps()} />
        <div>
          <BsCloudUpload />
          {hasText && (
            <span className='ms-2'>{props?.text || 'Tải tệp lên'}</span>
          )}
        </div>
      </Button>

      <Form.Text>
        {uploading && (
          <p>
            Đang tải lên{' '}
            {uploadPercent}%{' '}
            {currentFile ? `tệp ${currentFile.name}` : 'tệp'}
          </p>
        )}
        {fileRejections.map(({ errors }) =>
          errors.map((error) => (
            <p key={error.code} className='my-2 text-center text-danger'>
              {error.message}
            </p>
          ))
        )}
      </Form.Text>

      {props?.fileName && (
        <div className='d-block fw-bold my-2'>{props?.fileName}</div>
      )}
    </div>
  );
}

export default FileUploader;
