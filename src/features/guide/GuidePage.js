import React, { useState, useEffect } from 'react'
import Loading from 'shared/components/Loading'
import TitleBar from 'shared/components/TitleBar'
import styles from './styles.module.css'
import guideApi from 'api/guideApi'
import { useNavigate } from 'react-router-dom'

export default function GuidePage() {
  const navigate = useNavigate()
  const PAGE = 0
  const LIMIT = 10
  const [loading, setLoading] = useState(true)
  const [guideList, setGuideList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await guideApi.getVisibleGuides(PAGE, LIMIT)

        setGuideList(data?.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReadMoreButton = id => {
    navigate(`/guide?id=${id}`)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <TitleBar title="Cẩm nang sinh viên" />
      <div className={styles.guideContainer}>
        {guideList.length === 0 ? (
          <p style={{ textAlign: 'center' }}>
            Rất tiếc. Hiện chưa có bài viết mới.
            <br />
            Vui lòng quay lại sau!
          </p>
        ) : null}
        <div className={styles.guideListContainer}>
          {guideList.map(child => {
            return (
              <div className={styles.guideItemContainer} key={child._id}>
                <h3 className={styles.title}>{child.title}</h3>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: child.content }}></div>
                <button className={styles.button} onClick={() => handleReadMoreButton(child._id)}>
                  Đọc tiếp
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
