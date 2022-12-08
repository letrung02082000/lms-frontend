// import axios from 'axios'
// import Loading from 'shared/components/Loading'
// import TitleBar from 'shared/components/TitleBar'
// import QrReader from 'modern-react-qr-reader'
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { selectUser } from 'store/userSlice'
// import { authHeader } from 'utils'

// import { BikeUserInfo, UploadCard } from './components'
// import styles from './styles.module.css'

// export function BicyclePage(props) {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const query = new URLSearchParams(location.search)
//   const id = query.get('id')
//   const [data, setData] = useState(null)
//   const [scanner, setScanner] = useState(null)
//   const [scanned, setScanned] = useState(null)

//   const user = useSelector(selectUser)

//   useEffect(() => {
//     axios
//       .get(`/api/bike/${id}`)
//       .then(res => {
//         setData(res.data)
//       })
//       .catch(err => alert('Không thể tải thông tin về xe mà bạn yêu cầu.'))
//   }, [user.isLoggedIn])

//   if (!data) {
//     return <Loading />
//   }

//   const handleScanButton = () => {
//     setScanner(false)
//     setScanner(true)
//   }

//   const handleError = error => {
//     console.log(error)
//     alert(
//       'Ứng dụng không có quyền truy cập camera. Vui lòng cấp quyền camera trên trình duyệt của bạn. Hoặc liên hệ: 0797324886 để được hỗ trợ nhanh nhất.'
//     )
//     window.location.reload()
//   }

//   const onNewScanResult = data => {
//     if (data) {
//       setScanner(false)
//       setScanned(true)

//       axios
//         .post('/api/bike-user', { bike: id, bikeToken: data }, authHeader())
//         .then(res => {
//           if (res.status === 200) {
//             console.log(res.data)
//             alert('Đăng ký thuê xe thành công!')
//             navigate.push('/bicycles')
//           }
//         })
//         .catch(err => {
//           if (err.response.status === 403) {
//             return alert('Bạn có 1 xe đang thuê. Vui lòng trả xe trước khi thuê lại!')
//           }

//           return alert('Mã QR đã hết hạn. Vui lòng tải lại mã mới trước khi quét!')
//         })
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <TitleBar title="Thuê xe" navigation="/bicycles" />
//       <div className={styles.resultContainer}>
//         {user.isLoggedIn ? (
//           <>
//             <BikeUserInfo />
//             <UploadCard />
//           </>
//         ) : (
//           <div className={styles.loginContainer}>
//             <p>Đăng nhập để sử dụng tính năng này</p>
//             <button onClick={() => navigate.push('/login')} className={styles.scanButton}>
//               Đăng nhập
//             </button>
//           </div>
//         )}
//       </div>

//       <div className={styles.scanContainer}>
//         {scanner ? (
//           <>
//             <QrReader
//               delay={100}
//               style={{ width: 320, height: 240, borderRadius: '5px' }}
//               onError={handleError}
//               onScan={onNewScanResult}
//               facingMode={'environment'}
//               legacyMode={false}
//             />
//             <p
//               style={{
//                 margin: 0,
//                 color: 'red',
//                 fontSize: '0.8rem',
//                 textAlign: 'center'
//               }}
//             >
//               Lấy mã QR tại máy nhân viên bảo vệ
//             </p>
//             <p
//               style={{
//                 margin: 0,
//                 color: 'var(--primary)',
//                 fontSize: '0.8rem',
//                 textAlign: 'center'
//               }}
//             >
//               Nếu xảy ra lỗi camera, vui lòng tải lại trang này hoặc liên hệ 0797324886 để được hỗ trợ nhanh nhất.
//             </p>
//           </>
//         ) : null}
//       </div>
//       <div className={styles.infoContainer}>
//         <p className={styles.name}>{data && data.name}</p>
//         {user.isLoggedIn ? (
//           <>
//             <button onClick={handleScanButton} className={styles.scanButton}>
//               {scanned ? 'Quét lại' : 'Quét QR để thuê xe này'}
//             </button>
//             <p
//               style={{
//                 color: 'red',
//                 fontSize: '0.8rem',
//                 textAlign: 'center'
//               }}
//             >
//               Quét mã QR do bảo vệ cung cấp
//             </p>
//           </>
//         ) : null}
//         <p className={styles.state}>{data && data.isAvailable ? 'Đang có sẵn' : 'Đã được thuê'}</p>
//         <p>Giá giờ: {data && data.hourPrice} VNĐ / giờ</p>
//         <p>Giá ngày: {data && data.dayPrice} VNĐ / ngày</p>
//         {data && data.dayPrice === 0 ? (
//           <p style={{ textAlign: 'center' }}>
//             Miễn phí trong vòng 24h đầu thuê, phụ phí 30.000 đồng/ngày nếu trả xe muộn hơn 24h.
//           </p>
//         ) : null}

//         <img src={data.images[0]} alt="image" />
//         <h5 className={styles.descriptionHeader}>Thông tin chi tiết</h5>
//         <p>{data && data.description}</p>
//       </div>
//     </div>
//   )
// }
