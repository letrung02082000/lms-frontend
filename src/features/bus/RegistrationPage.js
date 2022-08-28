import busApi from "api/busApi";
import TitleBar from "shared/components/TitleBar";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import InputField from "./components/InputField";
import Content from "./components/Content";

export function BusRegistrationPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitButton = (e) => {
    setIsLoading(true);

    busApi
      .createBusUser({
        name: e.name,
        tel: e.tel,
        zalo: e.zalo,
        note: e.note,
        address: e.address,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          setIsLoading(false);
          return alert(
            "Đăng ký thành công! Chúng mình sẽ liên hệ với bạn trong thời gian sớm nhất. Mọi thắc mắc liên hệ 0877.876.877 để được giải đáp. Xin cảm ơn!"
          );
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  return (
    <Styles>
      <TitleBar title="Đặt xe đưa rước" navigation="/uniforms" />

      <Form
        onSubmit={handleSubmit(handleSubmitButton)}
        className="drivingFormContainer"
      >
        <Content />
        <InputField
          register={register}
          name={"name"}
          label="Tên của bạn*"
          placeholder="Nhập đầy đủ họ tên, có dấu"
          errors={errors}
          require={true}
        ></InputField>
        <InputField
          register={register}
          name={"tel"}
          label=" Điện thoại liên hệ*"
          placeholder="Nhập số điện thoại liên hệ của bạn"
          require={true}
        ></InputField>
        <InputField
          register={register}
          name={"zalo"}
          label="TSố điện thoại Zalo (Không bắt buộc)"
          placeholder="Nhập số điện thoại zalo của bạn"
          errors={errors}
        ></InputField>
        <InputField
          register={register}
          name={"address"}
          label="Địa chỉ đón bạn (Không bắt buộc)"
          placeholder="Bỏ trống nếu cần xác nhận lại sau"
          errors={errors}
        ></InputField>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Yêu cầu khác/Ghi chú (nếu có)</Form.Label>
          <Form.Control
            {...register("note")}
            as="textarea"
            rows={3}
            placeholder="Nhập yêu cầu của bạn nếu có"
          />
        </Form.Group>
        {isLoading ? (
          <Form.Group className="align-self-center">
            <Button variant="primary" type="submit" className="px-3" disabled>
              ... Đang đăng kí
            </Button>
          </Form.Group>
        ) : (
          <Form.Group className="align-self-center">
            <Button variant="primary" type="submit" className="px-3">
              Đăng kí
            </Button>
          </Form.Group>
        )}
      </Form>
    </Styles>
  );
}
const Styles = styled.div`
  .drivingFormContainer {
    width: 95%;
    margin: 1rem auto;
    padding: 1rem 1rem 5rem;
    border-radius: 1rem;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
  }
`;
