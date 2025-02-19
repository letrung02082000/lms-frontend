import { AgGridReact } from 'ag-grid-react';
import elearningApi from 'api/elearningApi';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCenter } from 'store/center';

function AdminElearningStudentPage() {
  const center = useSelector(selectCenter)?.data;
  const [colDefs, setColDefs] = useState([
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'fullname', headerName: 'Họ và tên', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'firstname', headerName: 'Họ', flex: 1 },
    { field: 'lastname', headerName: 'Tên', flex: 1 },
    { field: 'username', headerName: 'Tên đăng nhập', flex: 1 },
    { field: 'phone', headerName: 'Số điện thoại', flex: 1 },
  ]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    document.title = 'Quản trị | E-learning';

    if (center?.cohortId) {
      elearningApi
        .getCohortUsers(center.cohortId)
        .then((response) => {
          setRowData(response?.data);
        })
        .catch((error) => {
          console.log('Failed to fetch cohort users: ', error);
        });
    }
  }, []);

  return (
    <div className='ag-theme-quartz' style={{ height: '100%' }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}

export default AdminElearningStudentPage;
