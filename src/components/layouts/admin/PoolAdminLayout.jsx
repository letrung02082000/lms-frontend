import React from 'react'
import { useMemo } from 'react'
import { FaList } from 'react-icons/fa'
import { POOL_LESSON_USER, POOL_TICKET_USER } from 'constants/routes'
import AdminLayout from '../AdminLayoutV2'

function PoolAdminLayout() {
  const MENU = useMemo(() => {
    return [
      {
        label: 'Danh sách mua vé',
        path: POOL_TICKET_USER,
        icon: <FaList />
      },
      {
        label: 'Đăng ký học bơi',
        path: POOL_LESSON_USER,
        icon: <FaList />
      }
    ]
  }, [])

  return <AdminLayout menu={MENU} title="Quản lý hồ bơi" />
}

export default PoolAdminLayout
