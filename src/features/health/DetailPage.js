import React, { useEffect, useState } from 'react'
import Loading from 'shared/components/Loading'
import TitleBar from 'shared/components/TitleBar'
import styles from './styles.module.css'
import healthApi from 'api/healthApi'
import { useLocation } from 'react-router-dom'

export function HealthDetailPage(props) {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const healthId = search.get('id')
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    healthApi
      .getHealthById(healthId)
      .then(res => {
        if (res.data) {
          setHealth(res.data)
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
      {/* <TitleBar title="Bài viết" /> */}
      <div className={styles.guideContainer}>
        <h3>{health?.title}</h3>
        <span className={styles.date}>Đăng ngày: {new Date(health?.createdAt).toLocaleDateString('en-GB')}</span>
        <div dangerouslySetInnerHTML={{ __html: health?.content }}></div>
      </div>
    </>
  )
}
