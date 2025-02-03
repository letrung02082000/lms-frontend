import React, { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { generateDrivingMenu } from 'constants/menu'
import drivingApi from 'api/drivingApi';

function AdminDrivingLayout() {
  const [drivingTypes, setDrivingTypes] = React.useState([]);
  useEffect(() => {
    document.title = 'Quản lý đào tạo lái xe';
    drivingApi.getDrivingType().then(res => {
      setDrivingTypes(res.data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <AdminLayout menu={generateDrivingMenu(drivingTypes)} title='Quản lý lái xe'/>
  )
}

export default AdminDrivingLayout