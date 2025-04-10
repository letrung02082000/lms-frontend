import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePromptWithUnload(message, when) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    navigator.push = (...args) => {
      const confirm = window.confirm(message);
      if (confirm) {
        navigator.push = push;
        navigator.push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [message, when, navigator]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!when) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when]);
}
