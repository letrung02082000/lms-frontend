import React, { useEffect, useState } from 'react'
import Loading from 'shared/components/Loading'
import TitleBar from 'shared/components/TitleBar'
import styles from './styles.module.css'
import guideApi from '../../api/guideApi'
import { useLocation } from 'react-router-dom'

export default function GuideDetailPage(props) {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const guideId = search.get('id')
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    guideApi
      .getGuideById(guideId)
      .then(res => {
        if (res.data) {
          setGuide(res.data)
          setLoading(false)
        }
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <TitleBar title="Bài viết" />
      <div className={styles.guideContainer}>
        <h3>{guide?.title}</h3>
        <span className={styles.date}>Đăng ngày: {new Date(guide?.createdAt).toLocaleDateString('en-GB')}</span>
        <div dangerouslySetInnerHTML={{ __html: guide?.content }}></div>
      </div>
    </>
  )
}
