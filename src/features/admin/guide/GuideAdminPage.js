import AdminLayout from 'components/layouts/AdminLayout';
import AllGuides from './components/AllGuides';
import Creation from './components/Creation';
import Update from './components/Update';

function AdminGuidePage(props) {
  const search = new URLSearchParams(props.location.search);
  const navigation = search.get('navigation');
  const id = search.get('id');

  return (
    <AdminLayout
      title='Cẩm nang sinh viên'
      root='guide-admin'
      navigation={[
        { name: 'Tạo bài viết', path: 'creation' },
        { name: 'Tất cả bài viết', path: 'all' },
      ]}
    >
      {navigation === 'creation' ? <Creation /> : null}
      {navigation === 'update' ? <Update id={id} /> : null}
      {navigation === 'all' ? <AllGuides /> : null}
    </AdminLayout>
  );
}

export default AdminGuidePage;
