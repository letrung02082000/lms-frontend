import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import InputField from '../../../components/form/InputField'
import uniformApi from 'api/uniformApi'
import { toastWrapper } from 'utils'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

function RegistrationForm() {
  const userInfo = JSON.parse(localStorage.getItem('user-info') || '{}')
  const [loading, setLoading] = useState(false)

  const { handleSubmit, control, reset, setError } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: userInfo?.name,
      tel: userInfo?.tel,
      zalo: userInfo?.zalo
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined
  })

  const onSubmit = data => {
    const quantity = parseInt(data?.quantity)

    if (!Number.isInteger(quantity) || Number(quantity) <= 0) {
      return setError('quantity', {
        type: 'custom',
        message: 'Số lượng phải lớn hơn 0',
        shouldFocus: true
      })
    }

    setLoading(true)
    uniformApi
      .register(data)
      .then(res => {
        console.log(res)
        reset({
          name: '',
          tel: '',
          zalo: '',
          note: '',
          quantity: ''
        })
        toastWrapper('Đăng ký thành công. Chúng mình sẽ liên hệ với bạn trong thời gian sớm nhất!', 'success')
        setLoading(false)
      })
      .catch(error => {
        toastWrapper('Đăng ký thất bại. Vui lòng liên hệ di động/zalo 0877876877 để được hỗ trợ!', 'error')
        setLoading(false)
      })
  }

  return (
    <Styles>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputField label={'Tên của bạn'} control={control} name="name" />
        <InputField label={'Điện thoại liên hệ'} control={control} name="tel" />
        <InputField label={'Zalo'} control={control} name="zalo" />
        <InputField label={'Số lượng dự kiến'} control={control} name="quantity" />
        <InputField
          label={'Ghi chú'}
          placeholder="Nhập ghi chú hoặc góp ý của bạn"
          as="textarea"
          rows={3}
          control={control}
          name="note"
          rules={{ required: false }}
        />
        {loading ? (
          <Button variant="primary" className="submit-btn" type="button">
            Vui lòng chờ...
          </Button>
        ) : (
          <Button variant="primary" className="submit-btn" type="submit">
            Đăng ký ngay
          </Button>
        )}
      </Form>
    </Styles>
  )
}

export default RegistrationForm

const Styles = styled.div`
  .submit-btn {
    background-color: var(--primary);
    border-color: var(--primary);
    width: 100%;
    margin: 1rem 0 5rem;
  }

  .files-stack {
  }
`
