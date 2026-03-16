'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

// Minimal NProgress CSS injected inline to avoid extra file dependency
const nprogressStyles = `
#nprogress {
  pointer-events: none;
}
#nprogress .bar {
  background: hsl(var(--primary, 220 14% 20%));
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.5px;
}
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px hsl(var(--primary, 220 14% 20%)), 0 0 5px hsl(var(--primary, 220 14% 20%));
  opacity: 1;
  transform: rotate(3deg) translate(0px, -4px);
}
`;

NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.2 });

export function RouteProgress() {
    const pathname = usePathname();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        if (previousPathname.current !== pathname) {
            NProgress.start();
            // Complete after a short tick (Next.js has already loaded the route by now)
            const timer = setTimeout(() => NProgress.done(), 100);
            previousPathname.current = pathname;
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return <style>{nprogressStyles}</style>;
}
