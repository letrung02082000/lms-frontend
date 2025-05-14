import elearningApi from 'api/elearningApi';
import { GENDERS } from 'constants/driving-student.constant';
import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Image,
  Modal,
  ProgressBar,
  Row,
  Table,
  Form,
} from 'react-bootstrap';
import moodleApi from 'services/moodleApi';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import drivingApi from 'api/drivingApi';
import { MdEdit } from 'react-icons/md';
import FileUploader from 'components/form/FileUploader';
import { AVATAR_UPLOAD_URL, FILE_UPLOAD_URL } from 'constants/endpoints';
import { toastWrapper } from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import drivingStudentSchema from 'validations/driving-student.validation';
import InputField from 'components/form/InputField';
import { getVietnamDate } from 'utils/commonUtils';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectElearningCourses,
  selectElearningUser,
  updateElearningData,
} from 'store/elearning.slice';
import dayjs from 'dayjs';

function ElearningStudentMyPage() {
  const moodleToken = localStorage.getItem('moodleToken');
  const dispatch = useDispatch();
  const userName =
    JSON.parse(localStorage.getItem('moodleSiteInfo') || '{}')?.username ||
    null;
  const student = useSelector(selectElearningUser);
  const elearningCourses = useSelector(selectElearningCourses);
  const courses = useMemo(() => {
    if (!elearningCourses) return [];
    return Object?.values(elearningCourses)?.filter((course) => student?.elearningLessons?.includes(course.id));
  }, [elearningCourses, student?.elearningLessons]);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [portraitData, setPortraitData] = React.useState(null);
  const [portraitUploading, setPortraitUploading] = React.useState(false);
  const studentEditableFields = useMemo(
    () => student?.course?.studentEditableFields || [],
    [student?.course?.studentEditableFields]
  );
  const { handleSubmit, setValue, control, clearErrors, reset, setError } =
    useForm({
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(drivingStudentSchema),
    });

  useEffect(() => {
    if (student) {
      if (student?.elearningAvatarUrl) {
        drivingApi
          .getPortraitImage(student?._id)
          .then((data) => {
            const url = URL.createObjectURL(data);
            dispatch(
              updateElearningData({
                elearningUser: { ...student, portraitUrl: url },
              })
            );
          })
          .catch(console.error);
      }
    }
  }, [student?._id]);

  const handleUpdateInfo = async () => {
    await handleSubmit(async (data) => {
      const { cardNumber, name, dob, gender, tel, address } = data;
      try {
        await drivingApi.updateDrivingByMoodleToken(moodleToken, {
          cardNumber,
          name,
          dob,
          gender,
          tel,
          address,
        });
        toastWrapper('Cập nhật thông tin thành công!', 'success');
      } catch (error) {
        toastWrapper('Cập nhật thông tin thất bại!', 'error');
      }
    })();
  };

  const handleUpdatePassword = async () => {
    await handleSubmit(async (data) => {
      const { oldPassword, newPassword } = data;
      let isValid = true;

      if (!oldPassword) {
        setError('oldPassword', {
          type: 'manual',
          message: 'Vui lòng nhập mật khẩu cũ',
        });
        isValid = false;
      }

      if (!newPassword || newPassword?.length < 8) {
        setError('newPassword', {
          type: 'manual',
          message: 'Mật khẩu phải có ít nhất 8 ký tự',
        });
        isValid = false;
      }

      if (newPassword !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Mật khẩu không khớp',
        });
        isValid = false;
      }

      if (!isValid) return;
      let newMoodleToken = null;

      try {
        newMoodleToken = await moodleApi.getToken(userName, oldPassword);
        toastWrapper('Cập nhật mật khẩu thành công!', 'success');
      } catch (error) {
        toastWrapper('Mật khẩu cũ không chính xác!', 'error');
      }

      if (newMoodleToken) {
        localStorage.setItem('moodleToken', newMoodleToken);
        try {
          await elearningApi.changeUserPasswordByMoodleToken(
            newMoodleToken,
            newPassword,
            oldPassword
          );
          toastWrapper('Cập nhật mật khẩu thành công!', 'success');
          reset();
          setConfirmPassword('');
          setNewPassword('');
        } catch (error) {
          console.error('Error updating password:', error);
          toastWrapper('Cập nhật mật khẩu thất bại!', 'error');
        }
      }
    })();
  };

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      <Container className='my-4'>
        <h2 className='mb-4 h2'>Thông tin cá nhân</h2>
        <Card className='mb-4 shadow-sm'>
          <Card.Body>
            <Row>
              <Col md={3} className='text-center'>
                <Image
                  src={
                    student?.elearningAvatarUrl ||
                    student?.portraitUrl ||
                    'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                  }
                  roundedCircle
                  width='150'
                  height='150'
                  style={{ objectFit: 'cover' }}
                  alt='avatar'
                  className='mb-3'
                />
                <div>
                  <Button
                    variant='outline-secondary'
                    className='rounded-pill'
                    onClick={() => setShowUpdateInfoModal(true)}
                  >
                    <MdEdit className='me-2' />
                    Cập nhật
                  </Button>
                </div>
              </Col>
              <Col md={6}>
                <h4>{student?.name || 'Chưa cập nhật'} </h4>
                <p>
                  <strong>Mã học viên:</strong>{' '}
                  {student?.registrationCode || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Số CMND/CCCD:</strong>{' '}
                  {student?.cardNumber || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Giới tính:</strong>{' '}
                  {GENDERS[student?.gender] || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>{' '}
                  {student?.dob
                    ? student?.dob?.length === 8
                      ? dayjs(student?.dob, 'YYYYMMDD').format('DD/MM/YYYY')
                      : new Date(student?.dob).toLocaleDateString('en-GB')
                    : 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>SĐT:</strong> {student?.tel || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{' '}
                  {student?.address || 'Chưa cập nhật'}
                </p>
              </Col>
              <Col md={3}>
                <h4>Khoá: {student?.course?.name || 'Chưa cập nhật'}</h4>
                <p>
                  <strong>Mã khoá học:</strong>{' '}
                  {student?.course?.code || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Hạng:</strong>{' '}
                  {student?.drivingType?.label || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Khai giảng:</strong>{' '}
                  {student?.course?.enrollmentDate
                    ? new Date(
                        student?.course?.enrollmentDate
                      ).toLocaleDateString('en-GB')
                    : 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Bế giảng:</strong>{' '}
                  {student?.course?.graduationDate
                    ? new Date(
                        student?.course?.graduationDate
                      ).toLocaleDateString('en-GB')
                    : 'Chưa cập nhật'}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          <Col
            md={3}
            className='d-flex align-items-center justify-content-center'
          >
            <div style={{ width: 250, height: 250 }} className='mb-3'>
              <CircularProgressbar
                value={
                  courses.length > 0
                    ? courses.reduce((sum, c) => sum + (c.progress || 0), 0) /
                      courses.length
                    : 0
                }
                text={`${
                  courses.length > 0
                    ? Math.round(
                        courses.reduce((sum, c) => sum + (c.progress || 0), 0) /
                          courses.length
                      )
                    : 0
                }%`}
                styles={buildStyles({
                  textSize: '18px',
                  pathColor: `var(--bs-primary)`,
                  textColor: '#000',
                  trailColor: '#d6d6d6',
                })}
              />
            </div>
          </Col>

          <Col md={9}>
            <Card className='shadow-sm'>
              <Card.Header>
                <h5>Quá trình học tập</h5>
              </Card.Header>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Môn học</th>
                    <th>Tiến độ</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((item, index) => (
                    <tr key={item?.id}>
                      <td>{index + 1}</td>
                      <td>{item.fullname}</td>
                      <td>
                        {item?.progress ? (
                          <ProgressBar
                            variant='primary'
                            now={item.progress}
                            label={`${Math.round(item.progress)}%`}
                            style={{ height: '20px' }}
                          />
                        ) : (
                          <span>Chưa có dữ liệu</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal
        show={showUpdateInfoModal}
        onHide={() => setShowUpdateInfoModal(false)}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
            <Card className='mb-4 shadow-sm'>
              <Card.Body>
                <Row>
                  <Col md={3} className='text-center'>
                    <Image
                      src={
                        student?.elearningAvatarUrl ||
                        student?.portraitUrl ||
                        'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                      }
                      roundedCircle
                      width='150'
                      height='150'
                      style={{ objectFit: 'cover' }}
                      alt='avatar'
                      className='mb-3'
                    />
                    <Row className='mb-3'>
                      <Col>
                        {new Date(student?.nextUpdateAvatarTime) >
                        new Date() ? (
                          <Alert
                            variant='warning'
                            className='mt-2'
                            show={
                              new Date(student?.nextUpdateAvatarTime) >
                              new Date()
                            }
                          >
                            Bạn đã cập nhật ảnh gần đây. Bạn có thể cập nhật lại
                            sau{' '}
                            {new Date(
                              student?.nextUpdateAvatarTime
                            ).toLocaleString('vi-VN')}
                          </Alert>
                        ) : (
                          <FileUploader
                            disabled={portraitUploading}
                            text='Tải lên ảnh chân dung'
                            className='d-flex align-items-center justify-content-center'
                            fileName={portraitData?.originalName}
                            onResponse={(res) =>
                              handleUpdateInfo({
                                elearningAvatarUrl: res?.data?.url,
                              })
                            }
                            url={AVATAR_UPLOAD_URL}
                            name='file'
                            uploading={portraitUploading}
                            setUploading={setPortraitUploading}
                            accept={{
                              'image/png': ['.png'],
                              'image/jpeg': ['.jpg', '.jpeg'],
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={9}>
                    <h5>Thông tin cá nhân</h5>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Họ và tên'
                          name='name'
                          placeholder='Nhập họ và tên'
                          control={control}
                          defaultValue={student?.name}
                          disabled={!studentEditableFields?.includes('name')}
                          noClear={true}
                        />
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Số CCCD/CMND'
                          name='cardNumber'
                          placeholder='Nhập số CCCD/CMND'
                          control={control}
                          defaultValue={student?.cardNumber}
                          disabled={
                            !studentEditableFields?.includes('cardNumber')
                          }
                          noClear={true}
                        />
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Ngày sinh'
                          name='dob'
                          placeholder='Nhập ngày sinh'
                          type='date'
                          control={control}
                          defaultValue={getVietnamDate(student?.dob)}
                          disabled={!studentEditableFields?.includes('dob')}
                          noClear={true}
                        />
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Giới tính'
                          name='gender'
                          control={control}
                          defaultValue={student?.gender}
                          disabled={!studentEditableFields?.includes('gender')}
                          noClear={true}
                          as='select'
                        >
                          <option value=''>Chọn giới tính</option>
                          {Object.entries(GENDERS).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </InputField>
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Số điện thoại'
                          name='tel'
                          placeholder='Nhập số điện thoại'
                          control={control}
                          defaultValue={student?.tel}
                          disabled={!studentEditableFields?.includes('tel')}
                          noClear={true}
                        />
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Địa chỉ'
                          name='address'
                          placeholder='Nhập địa chỉ'
                          control={control}
                          defaultValue={student?.address}
                          disabled={!studentEditableFields?.includes('address')}
                          noClear={true}
                        />
                      </Col>
                    </Row>

                    <Row className='mb-3'>
                      <Col onClick={handleUpdateInfo}>
                        <Button>Cập nhật thông tin</Button>
                      </Col>
                    </Row>

                    <h5>Đổi mật khẩu</h5>

                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Mật khẩu cũ'
                          name='oldPassword'
                          placeholder='Nhập mật khẩu cũ'
                          type='password'
                          control={control}
                        />
                      </Col>
                    </Row>

                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Mật khẩu mới'
                          name='newPassword'
                          placeholder='Nhập mật khẩu mới'
                          type='password'
                          control={control}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setValue('newPassword', e.target.value);

                            if (e.target.value.length >= 8) {
                              clearErrors('newPassword');
                            }

                            if (e.target.value.length < 8) {
                              setError('newPassword', {
                                type: 'manual',
                                message: 'Mật khẩu phải có ít nhất 8 ký tự',
                              });
                            }
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className='mb-3'>
                      <Col>
                        <InputField
                          label='Xác nhận mật khẩu mới'
                          name='confirmPassword'
                          placeholder='Nhập lại mật khẩu mới'
                          type='password'
                          control={control}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setValue('confirmPassword', e.target.value);

                            if (e.target.value === newPassword) {
                              clearErrors('confirmPassword');
                            } else {
                              setError('confirmPassword', {
                                type: 'manual',
                                message: 'Mật khẩu không khớp',
                              });
                            }
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className='mb-3'>
                      <Col>
                        <Button
                          variant='primary'
                          onClick={handleUpdatePassword}
                        >
                          Cập nhật mật khẩu
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ElearningStudentMyPage;
