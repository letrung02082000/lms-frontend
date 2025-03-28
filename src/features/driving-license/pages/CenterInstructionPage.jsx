import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toastWrapper } from "utils";
import drivingApi from "api/drivingApi";

export default function CenterInstructionPage(props) {
  const MAP_URL ='https://maps.app.goo.gl/kyq58xK5b8p4rEi1A';
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get("s");
  const navigate = useNavigate();
  const [dateList, setDateList] = useState([]);

  const centerShortName = useParams().shortName;
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
    const getDrivingDates = async (center) => {
      drivingApi
        .getFormVisible(center)
        .then((res) => {
          if (res?.data.length > 0) {
            let data = res?.data.map((child) => {
              return {
                ...child,
                date: new Date(child.date),
              };
            });

            setDateList(data);
          }
        })
        .catch((e) => {
          toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
        });
    };

    if (centerShortName) {
      drivingApi
        .queryDrivingCenters({
          filter: {
            visible: true,
            shortName: centerShortName,
          }
        })
        .then((res) => {
          if (res?.data?.length > 0) {
            const center = res?.data[0];
            document.title = center.name;
            setDrivingCenter(center);
            getDrivingDates(center?._id);
          }
        })
        .catch((e) => {
          toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
        });
    } else {
      getDrivingDates();
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: drivingCenter?.instruction }}>
    </div>
  );
}
