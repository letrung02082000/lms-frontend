import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { generateDrivingMenu } from 'constants/menu';
import drivingApi from 'api/drivingApi';
import { ROLE } from 'constants/role';

function AdminDrivingLayout() {
  const { center, role } = JSON.parse(localStorage.getItem('user-info'));
  const [drivingTypes, setDrivingTypes] = React.useState([]);
  const [setting, setSetting] = React.useState({});

  useEffect(() => {
    document.title = 'Quản lý đào tạo lái xe';
    if (center) {
      drivingApi
        .queryDrivingCenterType({
          filter: {
            active: true,
            ...(center && { center }),
          },
        })
        .then((res) => {
          const drivingCenterTypes = res.data.map((drivingCenterType) => {
            return {
              label: drivingCenterType.drivingType.label,
              value: drivingCenterType.drivingType._id,
            };
          });
          setDrivingTypes(drivingCenterTypes);
        })
        .catch((err) => {
          console.log(err);
        });

      drivingApi
        .queryDrivingCenterSetting(center)
        .then((res) => {
          setSetting(res?.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType()
        .then((res) => {
          const drivingTypes = res.data.map((drivingType) => {
            return {
              label: drivingType.label,
              value: drivingType._id,
            };
          });
          setDrivingTypes(drivingTypes);
        })
        .catch((err) => {
          console.log(err);
        });

      if (
        role &&
        (role.includes(ROLE.ADMIN) || role.includes(ROLE.DRIVING.ADMIN))
      ) {
        setSetting({
          useStudentManagement: true,
          useInProcessManagement: true,
          useClassManagement: true,
          useTeacherManagement: true,
          useTypeManagement: true,
          useVehicleManagement: true,
        });
      }
    }
  }, []);

  return (
    <AdminLayout
      menu={generateDrivingMenu(drivingTypes, setting)}
      title='Quản lý lái xe'
    />
  );
}

export default AdminDrivingLayout;
