'use client';

import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-white">
      <div className="relative hidden md:block w-full md:w-[34%] h-40 md:h-screen overflow-hidden">
        <Image
          src="/IMG_20250908_225245.jpg"
          alt="side-image"
          fill
          className="object-center"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40 z-10" />
      </div>

      <div className="relative w-full md:w-[66%] md:h-screen p-4 md:p-0 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;