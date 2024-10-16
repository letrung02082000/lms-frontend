import React, { useState } from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import styles from './drivingAdminLayout.module.css'

//redux
import { selectDrivingData } from '../../store/drivingAdminSlice'
import { useSelector } from 'react-redux'
import JSZip from 'jszip'
import { AiFillEyeInvisible } from 'react-icons/ai'
import { IoMdExit } from 'react-icons/io'
import { FaDownload, FaList } from "react-icons/fa";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import { BiSolidFileExport } from 'react-icons/bi'
import { DRIVING_STATE_LABEL } from 'features/admin/driving-license/constant'

function DrivingAdminLayout({ children, onNavigate, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const data = useSelector(selectDrivingData);
  console.log(data)

  const exportToCSV = (csvData, fileName) => {
    csvData = csvData.map((child, index) => {
      let NgayThi = new Date(child.date)
      NgayThi = NgayThi.toLocaleDateString()
      let Timestamp = new Date(child.createdAt)
      Timestamp = `${Timestamp.toLocaleDateString('en-GB')} ${Timestamp.toLocaleTimeString('en-GB')}`

      return {
        STT: index + 1,
        Timestamp,
        HoTen: child.name,
        NgayThi,
        SoDienThoai: child.tel,
        Zalo: child.zalo,
        ChanDung: child?.portraitUrl,
        ChanDungCat: child?.portraitClipUrl,
        MatTruoc: child?.frontUrl,
        MatSau: child?.backUrl,
        TrangThai: DRIVING_STATE_LABEL[child?.processState],
        GhiChu: child?.feedback || '',
        Cash: child.cash,
        NgaySinh: new Date(child.dob).toLocaleDateString("en-GB"),
        GioiTinh: child.gender,
        DiaChi: child.address,
        SoCCCD: child.cardNumber,
        NoiCap: child.cardProvider,
        NgayCap: new Date(child.cardProvidedDate).toLocaleDateString("en-GB"),
        NgayKhamSucKhoe: new Date(child.healthDate).toLocaleDateString("en-GB"),
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
    const portraitClipZip = new JSZip()
    const frontZip = new JSZip()
    const backZip = new JSZip()

    for (let index = 0; index < data.length; index++) {
      const drivingInfo = data[index];

      if(drivingInfo.portraitUrl) {
        const fileMimeType = drivingInfo.portraitUrl.split('.').pop();
        const portraitResponse = await fetch(drivingInfo.portraitUrl);
        const portraitBlob = await portraitResponse.blob();
        portraitZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, portraitBlob, { binary: true });
      }

      if(drivingInfo.portraitClipUrl) {
        const fileMimeType = drivingInfo.portraitClipUrl.split('.').pop();
        const portraitClipResponse = await fetch(drivingInfo.portraitClipUrl);
        const portraitClipBlob = await portraitClipResponse.blob();
        portraitClipZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, portraitClipBlob, { binary: true });
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
    });

    portraitClipZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "portrait-clip.zip");
    });

    frontZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "front-source.zip");
    });

    backZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "back-source.zip");
    });
  }

  return (
    <div className={styles.container}>
      <ProSidebar className="side-bar" collapsed={collapsed}>
        {!collapsed && <SidebarHeader className="header d-flex justify-content-center">
          <div className="my-4 fs-5 text-uppercase fw-bold">Quản lý sát hạch</div>
        </SidebarHeader>}
        <SidebarContent className="nav-bar-left">
          <Menu iconShape="circle">
            <MenuItem className="mb-3" onClick={() => onNavigate('/a1')} icon={<FaList/>}>
              Quản lý hồ sơ A1
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => onNavigate('/a2')} icon={<FaList/>}>
              Quản lý hồ sơ A2
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => exportToCSV(data, 'data')} icon={<BiSolidFileExport />}>
              Xuất danh sách
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => zipFile(data)} icon={<FaDownload />}>
              Tải xuống
            </MenuItem>
            <MenuItem
              className="mb-3"
              icon={<AiFillEyeInvisible />}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              Ẩn thanh bên
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu>
            <MenuItem icon={<IoMdExit />}>
              <div onClick={() => onLogout()}>Đăng xuất</div>
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
      <div className={styles.mainBoard}>{children}</div>
    </div>
  )
}

export default DrivingAdminLayout
