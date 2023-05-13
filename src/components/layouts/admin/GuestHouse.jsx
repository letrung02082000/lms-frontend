import React from 'react'
import { useMemo } from 'react'
import { FaList } from 'react-icons/fa'
import { IoIosCreate, IoIosAdd } from 'react-icons/io'
import { GoReport } from 'react-icons/go'
import { BiCategory } from 'react-icons/bi'
import AdminLayout from '../AdminLayoutV2'

function GuestHouseLayout() {
  const MENU = useMemo(() => {
    return [
      {
        label: 'Quản lý phòng',
        path: '',
        icon: <FaList />
      },
      {
        label: 'Tạo phòng',
        path: 'creation',
        icon: <IoIosAdd />
      },
      {
        label: 'Quản lý đăng ký',
        path: 'registrations',
        icon: <IoIosCreate />
      },
      {
        label: 'Báo hỏng',
        path: 'reports',
        icon: <GoReport />
      },
      {
        label: 'Quản lý loại phòng',
        path: 'categories',
        icon: <BiCategory />
      }
    ]
  }, [])

  return <AdminLayout menu={MENU} title="Nhà khách" />
}

export default GuestHouseLayout
