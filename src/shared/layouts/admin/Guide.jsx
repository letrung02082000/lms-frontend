import React from 'react';
import { useMemo } from 'react';
import { FaList } from 'react-icons/fa';
import { IoIosCreate } from 'react-icons/io';
import AdminLayout from '../AdminLayoutV2';

function GuideLayout() {
  const MENU = useMemo(() => {
    return [
      {
        label: 'Danh sách bài viết',
        path: '',
        icon: <FaList/>
      },
      {
        label: 'Tạo bài viết',
        path: 'create',
        icon: <IoIosCreate/>
      },
    ];
  }, []);

  return <AdminLayout menu={MENU} title='Cẩm nang'/>;
}

export default GuideLayout;
