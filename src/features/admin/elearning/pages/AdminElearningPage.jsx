import { AgGridReact } from 'ag-grid-react';
import elearningApi from 'api/elearningApi';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { selectCenter } from 'store/center';

function AdminElearningPage() {
  const [courses, setCourses] = useState([]);
  const center = useSelector(selectCenter)?.data;
  const [colDefs, setColDefs] = useState([
    {
      field: 'timecreated',
      headerName: 'Ngày tạo',
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value * 1000).toLocaleDateString('en-GB'),
    },
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'displayname', headerName: 'Tên khoá học', flex: 1 },
    { field: 'idnumber', headerName: 'Mã khoá học', flex: 1 },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 1,
      cellRenderer: (params) => {
        return (
          <div className='d-flex align-items-center'>
            <Button variant='white'>
              <MdEdit />
            </Button>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    if (!center?.categoryId) return;

    elearningApi
      .getCenterCourses(center.categoryId)
      .then((response) => {
        setCourses(response?.data?.courses);
      })
      .catch((error) => console.log('Failed to fetch courses: ', error));
  }, [center?.categoryId]);

  return (
    <div className='ag-theme-quartz' style={{ height: '100%' }}>
      <AgGridReact rowData={courses} columnDefs={colDefs} />
    </div>
  );
}

export default AdminElearningPage;
