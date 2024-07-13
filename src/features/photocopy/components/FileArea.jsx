import React from 'react';
import RadioField2 from './RadioField2';
import UploadArea from './UploadArea';
import PropTypes from 'prop-types';
import UrlArea from './UrlArea';

function FileArea(props) {
  const uploadOptions = [
    {
      label: 'Tải lên tài liệu',
      value: 'file',
      component: (
        <UploadArea
          fileList={props?.fileList}
          setFileList={props?.setFileList}
        />
      ),
    },
    {
      label: 'Hoặc nhập đường dẫn đến tài liệu',
      value: 'url',
      component: (
        <UrlArea
          urlList={props?.urlList}
          setUrlList={props?.setUrlList}
        />
      ),
    },
    {
      label: 'Trung tâm tư vấn và thiết kế mẫu',
      value: 'design',
    },
    // {
    //   label: 'Không có tài liệu',
    //   value: 'no-file',
    //   component: (
    //     <UrlArea
    //       urlList={props?.urlList}
    //       setUrlList={props?.setUrlList}
    //     />
    //   ),
    // },
  ];

  return (
    <RadioField2
      options={uploadOptions}
      labelClasses='fw-bold'
      onChange={(v) => props?.setUploadType(v)}
      name='uploadType'
      checkValue={props?.uploadType}
    />
  );
}

export default FileArea;

FileArea.propTypes = {
  fileList: PropTypes.array.isRequired,
  setFileList: PropTypes.func.isRequired,
  urlList: PropTypes.array.isRequired,
  setUrlList: PropTypes.func.isRequired,
};
