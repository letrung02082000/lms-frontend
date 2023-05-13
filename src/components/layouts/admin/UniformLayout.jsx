import React from 'react'
import { useMemo } from 'react'
import { FaList } from 'react-icons/fa'
import AdminLayout from '../AdminLayoutV2'

function UniformLayout() {
  const MENU = useMemo(() => {
    return [
      {
        label: 'Danh sách đơn hàng',
        path: '',
        icon: <FaList />
      },
    ]
  }, [])

  return <AdminLayout menu={MENU} title="ĐỒNG PHỤC" />
}

export default UniformLayout
