import React from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import uniformApi from 'api/uniformApi';
import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { convertToDateTime } from 'utils/commonUtils';
import guesthouseApi from 'api/guesthouseApi';
import GuestRoomModal from '../components/GuestRoomModal';

function ReportPage() {
  const [page, setPage] = useState(0);
  const [roomSelected, setRoomSelected] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const PER_PAGE = 100;

  const columns = useMemo(
    () => [
      {
        Header: 'Số phòng',
        accessor: 'number',
      },
      {
        Header: 'Khách hàng',
        accessor: 'name',
      },
      {
        Header: 'Di động',
        accessor: 'tel',
      },
      {
        Header: 'Loại phòng',
        accessor: 'category',
        Cell: ({ row }) => {
          return <span>{row.values?.category?.name}</span>;
        },
      },
      {
        Header: 'Tình trạng',
        accessor: 'isAvailable',
        Cell: ({ row }) => {
          return (
            <>
              {row.values?.isAvailable ? (
                <span className='text-success fw-bold'>Còn trống</span>
              ) : (
                'Đã đặt'
              )}
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    guesthouseApi
      .getRooms(page, PER_PAGE)
      .then((res) => {
        setRoomList(res.data);
      })
      .catch((err) => alert(err.toString()));
  }, [page]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: roomList,
    });

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
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
                <td>
                  <Button variant='success' onClick={() => setRoomSelected(row?.original)}>
                    Cập nhật
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <GuestRoomModal show={!!roomSelected} setShow={setRoomSelected} data={roomSelected}/>
    </>
  );
}

export default ReportPage;
