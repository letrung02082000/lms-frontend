import guideApi from 'api/guideApi'
import Loading from 'components/Loading'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './allGuides.module.css'

function AllGuides() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const [guideList, setGuideList] = useState([])

  useEffect(() => {
    guideApi
      .getAllGuides(page, limit)
      .then(res => {
        setGuideList(res.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }, [page])

  const handleUpdateButton = id => {
    navigate(id)
  }

  const toggleVisibleButton = (id, isVisible) => {
    guideApi
      .updateGuide(id, { isVisible })
      .then(res => {
        guideApi
          .getAllGuides(page, limit)
          .then(res => {
            setGuideList(res.data)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
          })
      })
      .catch(err => {
        alert(err.toString())
      })
  }

  const handlePageChange = value => {
    if (value < 0) {
      return
    }

    setPage(value)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className={styles.container}>
      {guideList.length === 0 ? <span>Không có dữ liệu</span> : null}
      {guideList.map(child => {
        return (
          <div className={styles.itemContainer} key={child._id}>
            <div className={styles.contentContainer}>
              <h2>{child.title}</h2>
              <p className={styles.content} dangerouslySetInnerHTML={{ __html: child.content }}></p>
              <span>Độ ưu tiên: {child.priority}</span>
              <p>
                Ngày tạo: {new Date(child.createdAt).toLocaleDateString('en-GB')},{' '}
                {new Date(child.createdAt).toLocaleTimeString('en-GB')}
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={() => handleUpdateButton(child._id)}>Chỉnh sửa</button>
              <button
                style={
                  child.isVisible
                    ? { backgroundColor: 'var(--primary)', color: 'white' }
                    : { color: 'red', borderColor: 'red' }
                }
                onClick={() => toggleVisibleButton(child._id, !child.isVisible)}
              >
                {child.isVisible ? 'Ẩn bài viết' : 'Hiện bài viết'}
              </button>
            </div>
          </div>
        )
      })}
      <div className={styles.pagingContainer}>
        <button className={styles.button} onClick={() => handlePageChange(page - 1)}>
          {'<'}
        </button>
        {page + 1}
        <button className={styles.button} onClick={() => handlePageChange(page + 1)}>
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default AllGuides
