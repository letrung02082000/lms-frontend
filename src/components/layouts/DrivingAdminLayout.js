import React, { useState } from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import styles from './drivingAdminLayout.module.css'

//redux
import { selectDrivingData } from '../../store/drivingAdminSlice'
import { useSelector } from 'react-redux'
import drivingApi from 'api/drivingApi'
import JSZip from 'jszip'

function DrivingAdminLayout({ children, onNavigate, onLogout }) {
  const [visible, setVisible] = useState(true)
  const data = useSelector(selectDrivingData)
  const [zipping, setZipping] = useState(false)

  const exportToCSV = (csvData, fileName) => {
    csvData = csvData.map((child, index) => {
      let NgayThi = new Date(child.date)
      let TimeStamp = new Date(child.createdAt)
      NgayThi = NgayThi.toLocaleDateString()
      let Timestamp = new Date(child.createdAt)
      Timestamp = `${Timestamp.toLocaleDateString('en-GB')} ${Timestamp.toLocaleTimeString('en-GB')}`

      const PhuongThucThanhToan = child.paymentMethod === 0 ? 'Trực tiếp' : 'Chuyển khoản'

      let TrangThai = ''
      if (child.processState == 0) {
        TrangThai = 'Đã tạo'
      } else if (child.processState == 1) {
        TrangThai = 'Chờ cập nhật thông tin'
      } else if (child.processState == 2) {
        TrangThai = 'Chờ thanh toán'
      } else if (child.processState == 3) {
        TrangThai = 'Đã hoàn tất'
      } else if (child.processState == 4) {
        TrangThai = 'Đã hủy'
      }

      return {
        STT: index + 1,
        Timestamp,
        HoTen: child.name,
        NgayThi,
        SoDienThoai: child.tel,
        Zalo: child.zalo,
        ChanDung: `https://drive.google.com/file/d/${child.portraitId}/view`,
        MatTruoc: `https://drive.google.com/file/d/${child.frontsideId}/view`,
        MatSau: `https://drive.google.com/file/d/${child.backsideId}/view`,
        PhuongThucThanhToan,
        TrangThai,
        GhiChu: child?.feedback || '',
      }
    })
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(csvData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const zipFile = async (data) => {
    const portraitZip = new JSZip()
    const frontZip = new JSZip()
    const backZip = new JSZip()

    setZipping(true);

    for (let index = 0; index < data.length; index++) {
      const drivingInfo = data[index];

      if(drivingInfo.portraitUrl) {
        const fileMimeType = drivingInfo.portraitUrl.split('.').pop();
        const portraitResponse = await fetch(drivingInfo.portraitUrl);
        const portraitBlob = await portraitResponse.blob();
        portraitZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, portraitBlob, { binary: true });
      }

      if(drivingInfo.frontUrl) {
        const fileMimeType = drivingInfo.frontUrl.split('.').pop();
        const frontResponse = await fetch(drivingInfo.frontUrl);
        const frontBlob = await frontResponse.blob();
        frontZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, frontBlob, { binary: true });
      }

      if(drivingInfo.backUrl) {
        const fileMimeType = drivingInfo.backUrl.split('.').pop();
        const backResponse = await fetch(drivingInfo.backUrl);
        const backBlob = await backResponse.blob();
        backZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, backBlob, { binary: true });
      }
    }

    portraitZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "portrait.zip");
      setZipping(false);
    });

    setZipping(true);

    frontZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "front-source.zip");
      setZipping(false);
    });

    setZipping(true);

    backZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "back-source.zip");
      setZipping(false);
    });
  }

  return (
    <div className={styles.container}>
      {visible ? (
        <div className={styles.leftNav}>
          <h3 className={styles.pageTitle}>
            Quản lý
            <br />
            hồ sơ lái xe
          </h3>
          <div className={styles.navItems}>
            <div>
              <div className={styles.navItem} onClick={() => onNavigate('/a1')}>
                <p>Quản lý hồ sơ A1</p>
              </div>
              <div className={styles.navItem} onClick={() => onNavigate('/a2')}>
                <p>Quản lý hồ sơ A2</p>
              </div>
              <div className={styles.navItem} onClick={() => onNavigate('/b2')}>
                <p>Quản lý hồ sơ B2</p>
              </div>
              <div className={styles.navItem} onClick={() => onNavigate('/date')}>
                <p>Quản lý ngày thi</p>
              </div>
              <div className={styles.navItem} onClick={() => exportToCSV(data, 'data')}>
                <p>Tạo File Excel</p>
              </div>
              <div className={styles.navItem} onClick={() => zipFile(data)}>
                {zipping ? <p>Đang nén...</p> : <p>Nén File</p>}
              </div>
              <div className={styles.navItem} onClick={() => setVisible(false)}>
                <p>Ẩn</p>
              </div>
            </div>
            <div className={styles.navItem} onClick={() => onLogout()}>
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
          Hiện
        </button>
      )}
      <div className={styles.mainBoard}>{children}</div>
    </div>
  )
}

export default DrivingAdminLayout
