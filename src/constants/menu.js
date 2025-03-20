import { PATH } from "./path";
import { FaList } from "react-icons/fa";

export const generateDrivingMenu = (drivingType, setting) => {
    const drivingTypeObj = drivingType.map((t) => {
        return {
            label: t?.label,
            path: PATH.DRIVING.ADMIN.QUERY + '?type=' + t?.value,
            icon: t?.icon || <FaList />
        }
    })

    const ADMIN_DRIVING_MENU = [
        setting?.useStudentManagement && {
            label: 'Danh sách hồ sơ',
            path: PATH.DRIVING.ADMIN.ROOT,
            icon: <FaList />,
        },
        setting?.useInProcessManagement && {
            label: 'Hồ sơ đang xử lý',
            path: PATH.DRIVING.ADMIN.QUERY,
            icon: <FaList />,
            children: drivingTypeObj
        },
        setting?.useClassManagement &&{
            label: 'Quản lý khoá học',
            path: PATH.DRIVING.ADMIN.CLASS,
            icon: <FaList />
        },
        setting?.useClassManagement &&{
            label: 'Quản lý ngày thi',
            path: PATH.DRIVING.ADMIN.DATE,
            icon: <FaList />
        },
        setting?.useTeacherManagement && {
            label: 'Quản lý giáo viên',
            path: PATH.DRIVING.ADMIN.TEACHER,
            icon: <FaList />
        },
        {
            label: 'Quản lý trung tâm',
            path: PATH.DRIVING.ADMIN.CENTER,
            icon: <FaList />
        },
        setting?.useTypeManagement && {
            label: 'Quản lý hạng bằng',
            path: PATH.DRIVING.ADMIN.TYPE,
            icon: <FaList />
        },
        setting?.useVehicleManagement && {
            label: 'Quản lý xe',
            path: PATH.DRIVING.ADMIN.VEHICLE,
            icon: <FaList />
        },
    ].filter(Boolean);
    return ADMIN_DRIVING_MENU;
}

export const ADMIN_ELEARNING_MENU = [
    {
        label: 'Quản lý khóa học',
        path: PATH.ELEARNING.ADMIN.ROOT,
        icon: <FaList />,
    },
    {
        label: 'Quản lý người dùng',
        path: PATH.ELEARNING.ADMIN.STUDENT,
        icon: <FaList />,
    }
]

export const STUDENT_ELEARNING_MENU = [
    {
        label: 'Khoá học của tôi',
        path: PATH.ELEARNING.STUDENT.ROOT,
        icon: <FaList />,
    },
    {
        label: 'Kết quả học tập',
        path: PATH.ELEARNING.STUDENT.RESULT,
        icon: <FaList />,
    },
]
