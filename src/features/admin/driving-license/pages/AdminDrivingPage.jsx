import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Form, Offcanvas, Pagination } from 'react-bootstrap';
import { MdFilterList, MdSearch } from 'react-icons/md';

function AdminDrivingA1Page() {
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [show, setShow] = useState(false);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'createdAt', headerName: 'Ngày tạo', flex: 1 },
    { field: 'name', headerName: 'Họ và tên', flex: 1 },
    { field: 'tel', headerName: 'Số điện thoại', flex: 1 },
    { field: 'zalo', headerName: 'Zalo', flex: 1 },
    { field: 'date', headerName: 'Ngày thi', flex: 1 },
    { field: 'isPaid', headerName: 'Đã thanh toán', flex: 1 },
    { field: 'cash', headerName: 'Số tiền', flex: 1 },
    { field: 'isPaid', headerName: 'Đã KSK', flex: 1 },
    { field: 'feedback', headerName: 'Ghi chú', flex: 1 },
    { field: 'processState', headerName: 'Trạng thái', flex: 1 },
    { field: 'source', headerName: 'Nguồn', flex: 1 },
  ]);

  useEffect(() => {
    drivingApi
      .getDrivings(query, page)
      .then((res) => {
        setRowData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });

    drivingApi
      .getDateVisible()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div style={{height: '9%'}} className='d-flex align-items-center ps-3 pe-5'>
        <Form.Control type='text' placeholder='Tìm theo tên hoặc số điện thoại'/>
        <MdSearch size={25} className='mx-3' />
        <MdFilterList size={25} className='mx-3' onClick={() => setShow(true)} />
      </div>
      <div
        className='ag-theme-quartz' // applying the grid theme
        style={{ height: '85%' }} // the grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
      <Pagination
        className='d-flex justify-content-center align-items-center'
        style={{
          height: '6%',
        }}
      >
        <Pagination.Item>
          {pagination.start +
            '-' +
            pagination.end +
            ' của ' +
            pagination.totalCount}
        </Pagination.Item>
        <Pagination.First onClick={() => setPage(1)}></Pagination.First>
        <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page <= 1}/>
        <Pagination.Item active>
          {pagination.page}/{pagination.totalPage}
        </Pagination.Item>
        <Pagination.Next onClick={() => setPage(page + 1)} disabled={page >= pagination.totalPage}/>
        <Pagination.Last onClick={() => setPage(pagination.totalPage)}></Pagination.Last>
      </Pagination>
      <Offcanvas className='bg-dark' show={show} onHide={() => setShow(false)} placement='end' backdrop={false} scroll={true}>
        <Offcanvas.Header closeButton closeVariant='white'>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default AdminDrivingA1Page;
