import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toastWrapper } from 'utils'
import { BsCloudUpload } from 'react-icons/bs'
import styled from 'styled-components'
import { Button, Form, Row } from 'react-bootstrap'
import axiosClient from 'api/axiosClient'
import Asterisk from './Asterisk'

function FileUploader({ className, hasAsterisk, hasLabel=true, hasText=true, ...props }) {
  const FILE_MAX_SIZE = 50 * 1024 * 1024
  const [uploadPercent, setUploadPercent] = useState(false)

  const onDropAccepted = useCallback(files => {
    props?.setUploading(true)
    let formData = new FormData()
    formData.append(props?.name, files[0])
    axiosClient
      .post(props?.url, formData, {
        onUploadProgress: progressEvent => {
          const percent = parseInt((progressEvent.loaded / progressEvent.total) * 100)
          setUploadPercent(percent / 2)

          if (percent === 100) {
            setTimeout(() => {
              setUploadPercent(75)
            }, 1500)
          }
        }
      })
      .then(res => {
        props?.onResponse(res)
        setUploadPercent(100)
        props?.setUploading(false)
      })
      .catch(err => {
        props?.setUploading(false)
        toastWrapper(err?.response?.data?.message, 'error')
      })
  }, [])

  const onDropRejected = file => {}

  const fileSizeValidator = file => {
    if (file.size > FILE_MAX_SIZE) {
      return {
        code: 'file-too-large',
        message: `Kích thước tệp không được vượt quá ${FILE_MAX_SIZE / 1024 / 1024}M`
      }
    }

    return null
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    validator: fileSizeValidator
  })

  return (
    <div>
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
        disabled={props?.uploading}
      >
        <input {...getInputProps()} />
        <div>
          <BsCloudUpload size={25}/>
          {hasText && (
            <span className='ms-2'>{props?.text || 'Tải tệp lên'}</span>
          )}
        </div>
      </Button>
      <div>
        <Form.Text>
          {props?.uploading && <p>Đang tải {uploadPercent}%</p>}
          {fileRejections?.[0]?.errors?.map((error) => {
            return (
              <p key={error?.code} className='my-2 text-center text-danger'>
                {error?.message}
              </p>
            );
          })}
        </Form.Text>
      </div>
      {props?.fileName && <div className='d-block fw-bold my-2'>{props?.fileName}</div>}
    </div>
  );
}

export default FileUploader