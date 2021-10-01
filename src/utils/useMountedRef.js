import { useRef, useEffect } from 'react';

const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      mountedRef.current = true;
    });
  }, []);

  return mountedRef;
};

export default useMountedRef;
