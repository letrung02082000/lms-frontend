import { PATH } from "./path";
import { FaList } from "react-icons/fa";

export const ADMIN_DRIVING_MENU = [
    {
        label: 'Hồ sơ dự thi',
        path: PATH.DRIVING.ADMIN.ROOT,
        icon: <FaList />
    },
    {
        label: 'Quản lý ngày thi',
        path: PATH.DRIVING.ADMIN.DATE,
        icon: <FaList />
    },
]