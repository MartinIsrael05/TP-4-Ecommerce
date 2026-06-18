"use client";
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="flex items-center py-12">

      <div className="w-1/2 flex flex-col justify-center">
        <h1 className="font-sora font-bold text-primary text-5xl">
          Fragancias que se<br />hacen a tu manera.
        </h1>
        <h2 className="font-sora font-semibold text-primary text-2xl mt-4">
          Elegi tu perfume favorito o crea el tuyo desde cero
        </h2>
      </div>

      <div className="w-1/2 flex flex-col items-center gap-4">
        <div className="relative w-[400px] h-[400px]">
          <Image
            src="/images/products/perfume.jpg"
            alt="Perfume"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
