import AdminLayout from 'components/layouts/AdminLayout'
import { useLocation } from 'react-router-dom'
import AllHealths from './components/AllHealths'
import Creation from './components/Creation'
import Update from './components/Update'

function AdminGuidePage(props) {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const navigation = search.get('navigation')
  const id = search.get('id')

  return (
    <AdminLayout
      title="Sức khỏe sinh viên"
      root="health-admin"
      navigation={[
        { name: 'Tạo bài viết', path: 'creation' },
        { name: 'Tất cả bài viết', path: 'all' }
      ]}
    >
      {navigation === 'creation' ? <Creation /> : null}
      {navigation === 'update' ? <Update id={id} /> : null}
      {navigation === 'all' ? <AllHealths /> : null}
    </AdminLayout>
  )
}

export default AdminGuidePage
