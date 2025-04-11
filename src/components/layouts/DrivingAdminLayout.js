import React, { useState } from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

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
import { DRIVING_STATE_LABEL, IDENTITY_CARD_TYPE } from 'features/admin/driving-license/constant'
import ocrApi from 'api/ocrApi'

function DrivingAdminLayout({ children, onNavigate, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const data = useSelector(selectDrivingData);

  const exportInfoCSV = async (drivingData) => {
    let index = 0, exportData = [];
    for(let child of drivingData) {
      try {
        const res = await ocrApi.getOcrInfo(child?.identityInfo);
        const identityInfo = res?.data?.info;
        const MaThuongTru = res?.data?.frontType === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT ? identityInfo[1]?.address_ward_code : identityInfo[0]?.address_ward_code;
        const ChiTietDiaChi = res?.data?.frontType === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT ? identityInfo[1]?.address?.split(identityInfo[1]?.address_ward)[0] : identityInfo[0]?.address?.split(identityInfo[1]?.address_ward)[0];
        const retData = {
          STT: ++index,
          HoTen: identityInfo[1]?.name,
          NgaySinh: identityInfo[1]?.dob,
          GioiTinh: identityInfo[1]?.gender,
          SoCCCD: identityInfo[1]?.id,
          MaThuongTru,
          ChiTietDiaChi,
        };
        exportData.push(retData);
      } catch (error) {
        exportData.push({
          STT: ++index,
          HoTen: child.name,
        });
      }
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    const fileName = `Danh_sach_nhap_lieu_${drivingData[0]?.date}_${drivingData?.length}`
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const exportToCSV = (csvData) => {
    csvData = csvData.map((child, index) => {
      const identityInfo = JSON.parse(child?.identityInfo || '[]');
      let NgayThi = new Date(child.date)
      NgayThi = NgayThi.toLocaleDateString('en-GB')
      let Timestamp = new Date(child.createdAt)
      Timestamp = `${Timestamp.toLocaleDateString('en-GB')} ${Timestamp.toLocaleTimeString('en-GB')}`
      let NgaySinh, GioiTinh, DiaChi, SoCCCD, NoiCap, NgayCap, CapNhat, SoDienThoai2;
      SoDienThoai2 = child.tel?.slice(0, 4) + '***' + child.tel?.slice(-3);
      let nameParts = child.name?.trim().split(' ');
      let lastName = nameParts.pop();
      let firstName = nameParts.join(' ');

      if (child?.cardProvidedDate) {
        NgayCap = new Date(child.cardProvidedDate).toLocaleDateString("en-GB");
      }

      if (identityInfo.length > 0) {
        NgaySinh = identityInfo[1]?.info?.dob;
        GioiTinh = identityInfo[1]?.info?.gender;
        DiaChi = identityInfo[1]?.info?.address;
        SoCCCD = identityInfo[1]?.info?.id;
        NoiCap = identityInfo[0]?.info?.issued_at;
        NgayCap = identityInfo[0]?.info?.issue_date;
      }

      if(child?.invalidCard && child?.invalidPortrait) {
        CapNhat = 'Chân dung, CCCD không hợp lệ';
      } else if(child?.invalidPortrait) {
        CapNhat = 'Chân dung không hợp lệ';
      } else if(child?.invalidCard) {
        CapNhat = 'CCCD không hợp lệ';
      } else {
        CapNhat = '';
      }

      return {
        STT: index + 1,
        Timestamp,
        HoVaTenDem: firstName,
        Ten: lastName,
        HoTen: child.name,
        NgayThi,
        SoDienThoai: child.tel,
        SoDienThoai2,
        TinhTrang: DRIVING_STATE_LABEL[child?.processState],
        CapNhat,
        ChuyenKhoan: child.cash,
        ThanhToan: child.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
        GhiChu: child?.feedback || '',
        Zalo: child.zalo,
        ChanDung: child?.portraitUrl,
        ChanDungCat: child?.portraitClipUrl,
        MatTruoc: child?.frontUrl,
        MatSau: child?.backUrl,
        NgaySinh: NgaySinh || new Date(child.dob).toLocaleDateString("en-GB"),
        GioiTinh: GioiTinh || child.gender,
        DiaChi: DiaChi || child.address,
        SoCCCD: SoCCCD || child.cardNumber,
        NoiCap: NoiCap || child.cardProvider,
        NgayCap: NgayCap,
        NgayKhamSucKhoe: child?.healthDate && new Date(child.healthDate).toLocaleDateString("en-GB"),
      }
    })
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const ws = XLSX.utils.json_to_sheet(csvData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    const fileName = `Danh_sach_nhap_lieu_${csvData[0]?.NgayThi}_${csvData?.length}`
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const zipCroppedCard = async (data) => {
    const frontCropZip = new JSZip()
    const backCropZip = new JSZip()

    for (let index = 0; index < data.length; index++) {
      const drivingInfo = data[index];

      if (drivingInfo?.identityInfo) {
        const frontFileName = `${drivingInfo.name}-${drivingInfo.tel}-1.jpg`;
        const backFileName = `${drivingInfo.name}-${drivingInfo.tel}-2.jpg`;
        const identityInfo = JSON.parse(drivingInfo.identityInfo);
        frontCropZip.file(frontFileName, identityInfo[1]?.info?.image, { base64: true });
        backCropZip.file(backFileName, identityInfo[0]?.info?.image, { base64: true });
      }
    }

    frontCropZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "front-target.zip");
    });

    backCropZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "back-target.zip");
    });
  }

  const zipCard = async (data) => {
    const frontZip = new JSZip()
    const backZip = new JSZip()

    for (let index = 0; index < data.length; index++) {
      const drivingInfo = data[index];

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

    frontZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "front-source.zip");
    });

    backZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "back-source.zip");
    });
  }

  const zipPortrait = async (data) => {
    const portraitZip = new JSZip()
    const portraitClipZip = new JSZip()

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
    }

    portraitZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "portrait.zip");
    });

    portraitClipZip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, "portrait-clip.zip");
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
            <MenuItem className="mb-3" onClick={() => exportToCSV(data)} icon={<BiSolidFileExport />}>
              Xuất danh sách thi
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => exportInfoCSV(data)} icon={<BiSolidFileExport />}>
              Xuất danh sách nhập liệu
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => zipPortrait(data)} icon={<FaDownload />}>
              Tải ảnh chân dung
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => zipCard(data)} icon={<FaDownload />}>
              Tải CCCD
            </MenuItem>
            <MenuItem className="mb-3" onClick={() => zipCroppedCard(data)} icon={<FaDownload />}>
              Tải CCCD đã cắt
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
