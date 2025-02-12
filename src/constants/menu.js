import { PATH } from "./path";
import { FaList } from "react-icons/fa";

export const generateDrivingMenu = (drivingType) => {
    const drivingTypeObj = drivingType.map((t) => {
        return {
            label: t?.label,
            path: PATH.DRIVING.ADMIN.QUERY + '?type=' + t?.value,
            icon: t?.icon || <FaList />
        }
    })

    const ADMIN_DRIVING_MENU = [
        {
            label: 'Danh sách hồ sơ',
            path: PATH.DRIVING.ADMIN.ROOT,
            icon: <FaList />,
        },
        ...(drivingType.length ? [{
            label: 'Quản lý hồ sơ',
            path: PATH.DRIVING.ADMIN.QUERY,
            icon: <FaList />,
            children: drivingTypeObj
        }] : []),
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

export const ADMIN_ELEARNING_MENU = [
    {
        label: 'Quản lý khóa học',
        path: PATH.ELEARNING.ADMIN.ROOT,
        icon: <FaList />,
    },
    {
        label: 'Quản lý học viên',
        path: PATH.ELEARNING.ADMIN.STUDENT,
        icon: <FaList />,
    }
]

export const STUDENT_ELEARNING_MENU = [
    {
        label: 'Khoá học của tôi',
        path: PATH.ELEARNING.STUDENT.COURSE,
        icon: <FaList />,
    },
    {
        label: 'Kết quả học tập',
        path: PATH.ELEARNING.STUDENT.RESULT,
        icon: <FaList />,
    },
]
