import { PATH } from "./path";
import { FaList } from "react-icons/fa";

export const ADMIN_DRIVING_MENU = [
    {
        label: 'Danh sách hồ sơ',
        path: PATH.DRIVING.ADMIN.ROOT,
        icon: <FaList />,
    },
    {
        label: 'Quản lý hồ sơ',
        path: PATH.DRIVING.ADMIN.ROOT,
        icon: <FaList />,
        children: [
            {
                label: 'Hạng A1',
                icon: <FaList />,
                path: PATH.DRIVING.ADMIN.A1,
            },
            {
                label: 'Hạng A2',
                icon: <FaList />,
                path: PATH.DRIVING.ADMIN.A2,
            },
            {
                label: 'Hạng khác',
                icon: <FaList />,
                path: PATH.DRIVING.ADMIN.B12,
            },
        ],
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
]
