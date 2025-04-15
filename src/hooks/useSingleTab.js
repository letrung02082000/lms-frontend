// hooks/useSingleTab.js
import { PATH } from 'constants/path';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSingleTab = (path) => {
    const location = useLocation();
    const TAB_ID = Math.random().toString(36).substr(2, 9);
    const STORAGE_KEY = 'singleTabLock';

    useEffect(() => {
        const isVideoPage = location.pathname.startsWith(path);

        if (!isVideoPage) return;

        localStorage.setItem(STORAGE_KEY, TAB_ID);

        const handleStorageChange = (event) => {
            if (event.key === STORAGE_KEY && event.newValue !== TAB_ID) {
                alert('Trang video đang mở ở một tab khác. Tab này sẽ bị đóng.');
                window.location.href = PATH.ELEARNING.STUDENT.ROOT;
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const handleUnload = () => {
            if (localStorage.getItem(STORAGE_KEY) === TAB_ID) {
                localStorage.removeItem(STORAGE_KEY);
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [location.pathname]);
};

export default useSingleTab;
