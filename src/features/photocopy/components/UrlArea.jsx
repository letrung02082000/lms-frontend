import React from 'react';
import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';
import InputField from 'components/form/InputField';
import styled from 'styled-components';

function UrlArea(props) {
  const { control, handleSubmit, setValue, setFocus } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const [urlDeleteId, setUrlDeleteId] = useState();
  const handleAddButton = async () => {
    await handleSubmit((formData) => {
      console.log(formData)
      props?.setUrlList((_prev) => {
        const ret = [..._prev, {fileUrl: formData?.fileUrl}]
        return ret;
      });
      setValue('fileUrl', '');
    })();
  };

  const handleDeleteButton = async (idx) => {
    if (idx === urlDeleteId) {
      props?.setUrlList((_prev) => {
        return [..._prev.slice(0, idx), ..._prev.slice(idx + 1)];
      });
      setUrlDeleteId(null);
    } else {
      setUrlDeleteId(idx);
    }
  };

  const handleClearButton = () => {
    setValue('fileUrl', '');
    setFocus('fileUrl');
  };

  return (
    <Styles>
      <Row>
        <Col lg={10}>
          <InputField
            noLabel
            placeholder='https://'
            control={control}
            name='fileUrl'
            className='mb-3'
            onClear={handleClearButton}
          />
        </Col>
        <Col>
          <Button className='w-100' onClick={handleAddButton}>
            Thêm
          </Button>
        </Col>
      </Row>
      <Row>
        {props?.urlList?.map((_item, _idx) => {
          return (
            <Row key={`${_item}_${_idx}`} className='ms-2 my-3'>
              <div className='d-flex'>
                <div className='mt-1 file-text'>
                  {_idx + 1}
                  {'. '}
                  <span className='text-success'>{_item?.fileUrl}</span>
                </div>
                <Button
                  variant='outline-danger delete-btn ms-3'
                  onClick={() => handleDeleteButton(_idx)}
                >
                  {_idx === urlDeleteId ? (
                    <div className='delete-text'>Nhấn để xoá</div>
                  ) : (
                    <MdDeleteOutline color='#ed3e3e' />
                  )}
                </Button>
              </div>
            </Row>
          );
        })}
      </Row>
    </Styles>
  );
}

export default UrlArea;

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
