import React from 'react'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import LazyImage from 'components/LazyImage'
import styled from 'styled-components'
import SearchOrder from './SearchOrder'
import {isInt} from 'validator'
import orderApi from 'api/photocopy/orderApi'
import { ToastWrapper } from 'utils'

function SearchModal(props) {
  const photocopyInfo = JSON.parse(localStorage.getItem('user-data') || '{}')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(false)
  const [term, setTerm] = useState(photocopyInfo?.tel || '')

  const handleSubmit = e => {
    let orderToken = localStorage.getItem('order-token');

    e.preventDefault()
    setLoading(true)
    if(isInt(term) && term.length === 10) {
      orderApi
        .searchOrders(term)
        .then((res) => {
          if(res?.data.length === 0) {
            ToastWrapper('Không tìm thấy đơn hàng');
          }

          res.data[0].token = orderToken;
          setData(res?.data);
          setLoading(false);
        })
        .catch((e) => {
          ToastWrapper('Không thể tải dữ liệu', 'error');
          setLoading(false);
        });
    } else {
      ToastWrapper('Số điện thoại không hợp lệ')
      setLoading(false);
    }
  }

  const generateOrder = data => {
    if (data.length === 0) return <p className='text-center'>Không tìm thấy đơn hàng của bạn</p>
    return data?.map(order => {
      return <SearchOrder key={order?.orderCode} {...order} />
    })
  }

  return (
    <Modal show={props?.show} onHide={() => props?.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Tra cứu đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Styles>
          <Form onSubmit={handleSubmit} className='my-2 d-flex flex-column'>
            <Form.Control
              type='text'
              name='term'
              placeholder='Nhập số điện thoại đơn hàng'
              autoFocus
              defaultValue={photocopyInfo?.tel}
              onChange={(e) => setTerm(e.target.value)}
            />
            <Button
              className='mt-3 mb-5'
              type='submit'
              variant='primary'
              disabled={loading}
            >
              Tìm kiếm
            </Button>
            <div>
              {data === false && (
                <div className='d-flex justify-content-center'>
                  <LazyImage
                    src='/document-search.jpg'
                    height={200}
                    width='auto'
                  />
                </div>
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

export default SearchModal

const Styles = styled.div`
  .placeholder-image {
    img {
      border-radius: 15px;
    }
  }
`
