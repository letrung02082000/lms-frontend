import { PATH } from "./path";
import { FaList } from "react-icons/fa";

export const generateDrivingMenu = (drivingType) => {
    const drivingTypeObj = drivingType.map((t) => {
        return {
            label: t?.label,
            path: PATH.DRIVING.ADMIN.LIST + '?type=' + t?._id,
            icon: t?.icon || <FaList />
        }
    })

    const ADMIN_DRIVING_MENU = [
        {
            label: 'Danh sách hồ sơ',
            path: PATH.DRIVING.ADMIN.ROOT,
            icon: <FaList />,
        },
        {
            label: 'Quản lý hồ sơ',
            path: PATH.DRIVING.ADMIN.LIST,
            icon: <FaList />,
            children:drivingTypeObj
        },
        {
            label: 'Quản lý ngày thi',
            path: PATH.DRIVING.ADMIN.DATE,
            icon: <FaList />
        },
        {
            label: 'Quản lý trung tâm',
            path: PATH.DRIVING.ADMIN.CENTER,
            icon: <FaList />
        },
    ];
    return ADMIN_DRIVING_MENU;
}
