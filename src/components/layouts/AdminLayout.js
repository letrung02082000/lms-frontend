import { useState } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function AdminLayout({ children, title, navigation, root }) {
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()

  const navigateTo = path => {
    navigate(`/${root}?navigation=${path}`)
  }

  return (
    <div>
      {visible ? (
        <div>
          <h3>{title || 'Quản trị'}</h3>
          <div>
            <div>
              {navigation?.map((child, index) => {
                return (
                  <div key={index} onClick={() => navigateTo(child.path)}>
                    <p>{child.name}</p>
                  </div>
                )
              })}
              <div onClick={() => setVisible(false)}>
                <p>Ẩn</p>
              </div>
            </div>

            <div>
              <p>Đăng xuất</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setVisible(true)
          }}
        >
          <MdOutlineChevronRight size="25" />
        </button>
      )}
      <div>{children}</div>
    </div>
  )
}

export default AdminLayout
