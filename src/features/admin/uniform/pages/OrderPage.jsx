import React from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import uniformApi from 'api/uniformApi';
import { useState } from 'react';
import { Table } from 'react-bootstrap';

function OrderPage() {
  const [page, setPage] = useState([]);
  const [uniformList, setUniformList] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Khách hàng',
        accessor: 'name',
      },
      {
        Header: 'Di động',
        accessor: 'tel',
      },
      {
        Header: 'Zalo',
        accessor: 'zalo',
      },
      {
        Header: 'Số lượng',
        accessor: 'quantity',
      },
      {
        Header: 'Ghi chú',
        accessor: 'note',
      },
    ],
    []
  );

  useEffect(() => {
    uniformApi
      .getUniformList(page)
      .then((res) => {
        console.log(res);
        setUniformList(res?.data);
      })
      .catch((e) => console.log(e));
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: uniformList,
    });

  return (
    <Table striped hover bordered {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            <th>#</th>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
                <td>{idx}</td>
            {row.cells.map((cell) => {
              return (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              );
            })}
          </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default OrderPage;
