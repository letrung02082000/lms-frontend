import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import FileUploader from './FileUploader'
import InputField from './InputField'
import SelectField from './SelectField'
import photocopyApi from 'api/photocopyApi'
import { ToastWrapper } from 'utils'
import RadioField from './RadioField'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

function CreationForm() {
  const [fileIds, setFileIds] = useState([]);
  const [receiptId, setReceiptId] = useState([]);
  console.log(receiptId)
  const [categories, setCategories] = useState([])
  const [offices, setOffices] = useState([])
  const deliveryOptions = [
    { label: 'Nhận tại cửa hàng', value: '0' },
    { label: 'Giao hàng tận nơi', value: '1' },
  ]
  const addressOptions = [
    { label: 'Kí túc xá Khu A', value: 'KTX Khu A' },
    { label: 'Kí túc xá Khu B', value: 'KTX Khu B' },
  ]
  const [isDelivered, setIsDelivered] = useState('0')
  const { handleSubmit, control } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined,
  })

  const handleDeliveryChange = (value) => {
    setIsDelivered(value)
  }

  const onSubmit = (data) => {
    if (data?.category) {
      data.category = data.category.value
    }

    if (data?.office) {
      data.office = data.office.value
    }

    if (data?.address) {
      data.address = data.address.value
    }
    
    const order = {
      ...data,
      ...(fileIds.length > 0 ? {document: fileIds[0]} : {}),
      ...(receiptId.length > 0 ? {receipt: receiptId[0]} : {}),
    }

    console.log(order)

    photocopyApi
      .addOrder(order)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    photocopyApi
      .getCategories()
      .then((data) => {
        setCategories(
          data?.data.map((c) => ({ label: c?.name, value: c?._id }))
        )
      })
      .catch((error) => {
        ToastWrapper(error?.response?.data?.message)
      })

    photocopyApi
      .getOffices()
      .then((data) => {
        console.log(data)
        setOffices(data?.data.map((c) => ({ label: c?.name, value: c?._id })))
      })
      .catch((error) => {
        ToastWrapper(error?.response?.data?.message)
      })
  }, [])

  return (
    <Styles>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FileUploader setFileIds={setFileIds}/>
        <InputField
          label={'Hoặc nhập liên kết đến tài liệu'}
          control={control}
          name='document'
        />
        <InputField
          label={'Hướng dẫn in'}
          // placeholder='Nhập hướng dẫn in cho nhân viên'
          as='textarea'
          rows={3}
          control={control}
          name='instruction'
        />
        <SelectField
          options={categories}
          label='Thể loại'
          control={control}
          name='category'
        />
        <InputField label={'Tên của bạn'} control={control} name='name' />
        <InputField label={'Điện thoại liên hệ'} control={control} name='tel' />
        <InputField label={'Zalo'} control={control} name='zalo' />
        <RadioField
          label='Hình thức giao hàng'
          options={deliveryOptions}
          name='deliveryType'
          onChange={handleDeliveryChange}
          checkValue={isDelivered}
        />
        {isDelivered === '0' && (
          <SelectField
            options={offices}
            label='Chọn chi nhánh'
            control={control}
            name='office'
          />
        )}
        {isDelivered === '1' && (
          <SelectField
            options={addressOptions}
            label='Chọn khu vực'
            control={control}
            name='address'
          />
        )}
        <FileUploader setFileIds={setReceiptId} label={'Tải lên hóa đơn đặt cọc (nếu có)'}/>
        <InputField
          label={'Ghi chú/Góp ý'}
          placeholder='Nhập ghi chú cho đơn hàng'
          as='textarea'
          rows={3}
          control={control}
          name='note'
          rules={{ required: false }}
        />
        <Button variant='primary' className='submit-btn' type='submit'>
          Gửi tài liệu ngay
        </Button>
      </Form>
    </Styles>
  )
}

export default CreationForm

const Styles = styled.div`
  .submit-btn {
    background-color: var(--primary);
    border-color: var(--primary);
    width: 100%;
    margin: 1rem 0 5rem;
  }
`