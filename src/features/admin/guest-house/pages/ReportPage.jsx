import React from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import uniformApi from 'api/uniformApi';
import { useState } from 'react';
import { Button, Pagination, Table } from 'react-bootstrap';
import { convertToDateTime } from 'utils/commonUtils';
import guesthouseApi from 'api/guesthouseApi';
import GuestRoomModal from '../components/GuestRoomModal';
import { toastWrapper } from 'utils';

function ReportPage() {
  const [page, setPage] = useState(0);
  const [roomSelected, setRoomSelected] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const PER_PAGE = 100;

  const columns = useMemo(
    () => [
      {
        Header: 'Ngày tạo',
        accessor: 'createdAt',
        Cell: ({ row }) => {
          return <span>{convertToDateTime(row.values?.createdAt)}</span>;
        },
      },
      {
        Header: 'Số phòng',
        accessor: 'guestHouse',
        Cell: ({ row }) => {
          return <span>{row.values?.guestHouse?.number}</span>;
        },
      },
      {
        Header: 'Ghi chú',
        accessor: 'note',
      },
    ],
    []
  );

  useEffect(() => {
    guesthouseApi.getListReport(page).then((res) => {
      setRoomList(res.data);
    }).catch((err) => {
      toastWrapper('Lấy danh sách phòng thất bại', 'error')
    });
  }, [page]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: roomList,
    });

  const handleStateButton = (id, state) => {
    guesthouseApi
      .patchReport(id, { state })
      .then((res) => {
        toastWrapper('Cập nhật trạng thái thành công', 'success');
        guesthouseApi
          .getListReport(page)
          .then((res) => {
            setRoomList(res.data);
          })
          .catch((err) => {
            toastWrapper('Lấy danh sách phòng thất bại', 'error')
          });
      })
      .catch((err) => {
        toastWrapper('Cập nhật trạng thái thất bại', 'error');
      });
  };

  return (
    <>
      <Table striped hover bordered {...getTableProps()}>
        <thead className='sticky-top bg-white'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              <th>Thao tác</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const {state, _id} = row.original;

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
                <td>
                  <Button variant={state === 0 ? 'secondary' : 'outline-secondary'} className='mb-2' onClick={() => handleStateButton(_id, 0)}>
                    Vừa tạo
                  </Button>
                  <Button variant={state === 1 ? 'success' : 'outline-success'} className='mb-2' onClick={() => handleStateButton(_id, 1)}>
                    Đã sửa
                  </Button>
                  <Button variant={state === 2 ? 'danger' : 'outline-danger'} className='mb-2' onClick={() => handleStateButton(_id, 2)}>
                    Đã huỷ
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className='d-flex justify-content-center'>
        <Pagination>
          <Pagination.First onClick={() => setPage(0)} />
          <Pagination.Prev onClick={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }} />
          <Pagination.Item active>{page + 1}</Pagination.Item>
          <Pagination.Next onClick={() => setPage(page + 1)} />
        </Pagination>
      </div>
    </>
  );
}

export default ReportPage;
