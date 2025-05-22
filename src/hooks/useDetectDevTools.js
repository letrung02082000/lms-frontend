import { useEffect, useRef } from 'react';

const useDetectDevTools = (onOpen) => {
    const devtoolsOpen = useRef(false);

    useEffect(() => {
        const detect = () => {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            const isOpen = widthDiff > threshold || heightDiff > threshold;

            if (isOpen && !devtoolsOpen.current) {
                devtoolsOpen.current = true;
                if (typeof onOpen === 'function') onOpen();
            }

            if (!isOpen && devtoolsOpen.current) {
                devtoolsOpen.current = false;
            }
        };

        const interval = setInterval(detect, 1000);
        return () => clearInterval(interval);
    }, [onOpen]);
};

export default useDetectDevTools;
