import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toastWrapper } from 'utils';
import drivingApi from 'api/drivingApi';

export default function CenterInstructionPage(props) {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get('s');

  const centerShortName = useParams().shortName;
  // const [courseList, setCourseList] = useState([]);
  const [drivingCenter, setDrivingCenter] = useState({});
  useEffect(() => {
    drivingApi
      .query({ shortName: centerShortName })
      .then((res) => {
        document.title = res.data[0].name;
        setDrivingCenter(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // const getDrivingCourses = async (center, drivingType) => {
    //   drivingApi.queryDrivingCourse({
    //     filter: { center, drivingType, visible: true }
    //   }).then((res) => {
    //     let courses = res?.data || [];

    //     if (!courses.length) {
    //       setCourseList([]);
    //       return toastWrapper('Hiện tại không có khoá thi nào được mở đăng ký, vui lòng quay lại sau', 'error');
    //     }

    //     setCourseList(courses)
    //   }).catch(() => {
    //     toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
    //   });
    // }

    if (centerShortName) {
      drivingApi
        .queryDrivingCenters({
          filter: {
            visible: true,
            shortName: centerShortName,
          },
        })
        .then((res) => {
          if (res?.data?.length > 0) {
            const center = res?.data[0];
            document.title = center.name;
            setDrivingCenter(center);
            // getDrivingCourses(center?._id);
          }
        })
        .catch((e) => {
          toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
        });
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: drivingCenter?.instruction }}></div>
  );
}
