import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import FileUploader from "../../../shared/components/form/FileUploader";
import InputField from "../../../shared/components/form/InputField";
import SelectField from "../../../shared/components/form/SelectField";
import photocopyApi from "api/photocopyApi";
import { ToastWrapper } from "utils";
import RadioField from "../../../shared/components/form/RadioField";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { AiOutlineDelete } from "react-icons/ai";
import OrderInfo from "../../../shared/components/form/OrderInfo";

function CreationForm() {
  const [orderInfo, setOrderInfo] = useState(false);
  const photocopyInfo = JSON.parse(
    localStorage.getItem("photocopy-info") || "{}"
  );
  const [fileIds, setFileIds] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptId, setReceiptId] = useState([]);
  const [receiptName, setReceiptName] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offices, setOffices] = useState([]);
  const deliveryOptions = [
    { label: "Nhận tại cửa hàng", value: "0" },
    { label: "Giao hàng tận nơi", value: "1" },
  ];
  const addressOptions = [
    { label: "Kí túc xá Khu A", value: "KTX Khu A" },
    { label: "Kí túc xá Khu B", value: "KTX Khu B" },
  ];
  const [isDelivered, setIsDelivered] = useState("0");
  const { handleSubmit, control, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: photocopyInfo?.name,
      tel: photocopyInfo?.tel,
      zalo: photocopyInfo?.zalo,
      instruction: photocopyInfo?.instruction,
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const handleDeliveryChange = (value) => {
    setIsDelivered(value);
  };

  const onSubmit = (data) => {
    if (fileUploading || receiptUploading) {
      return ToastWrapper("Vui lòng chờ tải tệp lên hoàn tất!");
    }

    if (data?.category) {
      data.category = data.category.value;
    }

    if (data?.office) {
      data.office = data.office.value;
    }

    if (data?.address) {
      data.address = data.address.value;
    }

    localStorage.setItem("photocopy-info", JSON.stringify(data));
    const order = {
      ...data,
      ...(fileIds.length > 0 ? { document: fileIds } : {}),
      ...(receiptId.length > 0 ? { receipt: receiptId } : {}),
      isDelivered: isDelivered === "1",
    };

    if (!order?.document) {
      return ToastWrapper(
        "Vui lòng tải lên tệp hoặc nhập liên kết đến tài liệu!",
        "error"
      );
    }

    photocopyApi
      .addOrder(order)
      .then((res) => {
        console.log(res);
        setFileIds([]);
        setReceiptId([]);
        setFileNames([]);
        setReceiptName("");
        setValue("document", "", { shouldValidate: true });
        ToastWrapper(res?.message || "Tạo đơn hàng thành công!", "success");
        setTimeout(() => {
          setOrderInfo(res?.data);
        }, 1000);
      })
      .catch((error) => {
        ToastWrapper(
          error?.response?.data?.message || "Tạo đơn hàng thất bại!",
          "error"
        );
      });
  };

  useEffect(() => {
    photocopyApi
      .getCategories()
      .then((data) => {
        setCategories(
          data?.data.map((c) => ({ label: c?.name, value: c?._id }))
        );
      })
      .catch((error) => {
        ToastWrapper(error?.response?.data?.message);
      });

    photocopyApi
      .getOffices()
      .then((data) => {
        setOffices(data?.data.map((c) => ({ label: c?.name, value: c?._id })));
      })
      .catch((error) => {
        ToastWrapper(error?.response?.data?.message);
      });
  }, []);

  const handleFileUpload = (value) => {
    if (fileIds.length > 10)
      return ToastWrapper("Chỉ có thể tải lên tối đa 10 tệp");
    setFileIds((prev) => [...prev, `https://drive.google.com/file/d/${value}`]);
  };
  const handleFileNames = (value) => setFileNames((prev) => [...prev, value]);
  const handleDeleteFile = (index) => {
    setFileIds((prev) => {
      const temp = [...prev];
      temp.splice(index, 1);
      return temp;
    });
    setFileNames((prev) => {
      const temp = [...prev];
      temp.splice(index, 1);
      return temp;
    });
  };

  if (orderInfo) {
    return <OrderInfo {...orderInfo} />;
  }

  return (
    <Styles>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="files-stack d-flex flex-column justify-content-center align-items-center">
          {fileNames?.map((name, index) => {
            return (
              <div
                key={`${name}_${index}`}
                className="d-flex align-items-center"
              >
                <span>{name}</span>
                <button
                  className="btn ms-2"
                  onClick={() => handleDeleteFile(index)}
                >
                  <AiOutlineDelete color="red" />
                </button>
              </div>
            );
          })}
        </div>
        <FileUploader
          setFileId={handleFileUpload}
          setFileName={handleFileNames}
          uploading={fileUploading}
          setUploading={setFileUploading}
          url={"/photocopy/upload/file"}
          name="document"
          text={fileIds.length > 0 ? "Thêm tài liệu khác" : "Thêm tài liệu"}
        />
        {fileIds.length === 0 && (
          <InputField
            label={"Hoặc nhập liên kết đến tài liệu"}
            control={control}
            name="document"
            rules={{ required: false }}
          />
        )}
        <InputField
          label={"Hướng dẫn in"}
          // placeholder='Nhập hướng dẫn in cho nhân viên'
          as="textarea"
          rows={3}
          control={control}
          name="instruction"
        />
        <SelectField
          options={categories}
          label="Thể loại"
          control={control}
          name="category"
        />
        <InputField label={"Tên của bạn"} control={control} name="name" />
        <InputField label={"Điện thoại liên hệ"} control={control} name="tel" />
        <InputField label={"Zalo"} control={control} name="zalo" />
        <RadioField
          label="Hình thức giao hàng"
          options={deliveryOptions}
          name="deliveryType"
          onChange={handleDeliveryChange}
          checkValue={isDelivered}
        />
        {isDelivered === "0" && (
          <SelectField
            options={offices}
            label="Chọn chi nhánh"
            control={control}
            name="office"
          />
        )}
        {isDelivered === "1" && (
          <SelectField
            options={addressOptions}
            label="Chọn khu vực"
            control={control}
            name="address"
          />
        )}
        <FileUploader
          setFileId={(value) =>
            setReceiptId((prev) => `https://drive.google.com/file/d/${value}`)
          }
          label={"Tải lên hóa đơn đặt cọc (nếu có)"}
          uploading={receiptUploading}
          setUploading={setReceiptUploading}
          setFileName={setReceiptName}
          url={"/photocopy/upload/receipt"}
          name="receipt"
        />
        <p className="w-100 text-center form-text">{receiptName}</p>
        <InputField
          label={"Ghi chú/Góp ý"}
          placeholder="Nhập ghi chú cho đơn hàng"
          as="textarea"
          rows={3}
          control={control}
          name="note"
          rules={{ required: false }}
        />
        <Button variant="primary" className="submit-btn" type="submit">
          Gửi tài liệu ngay
        </Button>
      </Form>
    </Styles>
  );
}

export default CreationForm;

const Styles = styled.div`
  .submit-btn {
    background-color: var(--primary);
    border-color: var(--primary);
    width: 100%;
    margin: 1rem 0 5rem;
  }

  .files-stack {
  }
`;
