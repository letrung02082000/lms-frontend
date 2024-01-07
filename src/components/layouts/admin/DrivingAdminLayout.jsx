import React from 'react'
import { useMemo } from 'react'
import { FaList } from 'react-icons/fa'
import AdminLayout from '../AdminLayoutV2'
import { PATH } from 'constants/path'

function DrivingAdminLayout() {
  const MENU = useMemo(() => {
    return [
      {
        label: 'Hồ sơ A1',
        path: PATH.ADMIN.DRIVING.A1,
        icon: <FaList />
      },
      {
        label: 'Hồ sơ A2',
        path: PATH.ADMIN.DRIVING.A2,
        icon: <FaList />
      },
      {
        label: 'Hồ sơ B1/B2',
        path: PATH.ADMIN.DRIVING.B1B2,
        icon: <FaList />
      },
      {
        label: 'Quản lý ngày thi',
        path: PATH.ADMIN.DRIVING.DATE,
        icon: <FaList />
      },
    ]
  }, [])

  return <AdminLayout menu={MENU} title="Lái xe" />
}

export default DrivingAdminLayout
