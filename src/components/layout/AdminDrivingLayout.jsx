import React, { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { generateDrivingMenu } from 'constants/menu'
import drivingApi from 'api/drivingApi';

function AdminDrivingLayout() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [drivingTypes, setDrivingTypes] = React.useState([]);

  useEffect(() => {
    document.title = 'Quản lý đào tạo lái xe';
    if(center) {
      drivingApi
      .queryDrivingCenterType({ center, active: true })
      .then((res) => {
        const drivingCenterTypes = res.data.map((drivingCenterType) => {
          return {
            label: drivingCenterType.drivingType.label,
            value: drivingCenterType.drivingType._id,
          }
        });
        setDrivingTypes(drivingCenterTypes);
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
          }
        });
        setDrivingTypes(drivingTypes);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

  return (
    <AdminLayout menu={generateDrivingMenu(drivingTypes)} title='Quản lý lái xe'/>
  )
}

export default AdminDrivingLayout