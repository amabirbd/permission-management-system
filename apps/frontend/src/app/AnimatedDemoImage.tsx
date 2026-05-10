'use client';

import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

type AnimatedDemoImageProps = {
  src: StaticImageData;
};

export function AnimatedDemoImage({ src }: AnimatedDemoImageProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setEntered(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className={`absolute bottom-[8.2%] left-[14.2%] right-[1.8%] top-[8.4%] origin-right transition-[transform] duration-[920ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${entered ? 'translate-x-0 scale-100' : 'translate-x-[58%] scale-[0.74]'}`}>
      <Image alt="Dashboard preview" className="h-full w-full rounded-[12px] object-cover object-left-top shadow-[0_28px_80px_rgba(74,30,20,0.26)]" priority src={src} sizes="56vw" />
    </div>
  );
}
