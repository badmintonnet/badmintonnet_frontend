"use client";

import Image from "next/image";

interface Logo {
  url: string;
  alt?: string;
  id?: string;
}

interface BrandMarqueeProps {
  logos: Logo[];
}

export default function BrandMarquee({ logos }: BrandMarqueeProps) {
  const duplicated = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 ">
      {/* fade left */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent dark:from-gray-900" />
      {/* fade right */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent dark:from-gray-900" />

      <div className="flex w-max animate-marquee items-center space-x-16">
        {duplicated.map((logo, i) => (
          <div key={`${logo.id || logo.url}-${i}`} className="flex-shrink-0">
            <Image
              src={logo.url}
              alt={logo.alt || `brand-${i}`}
              width={300}
              height={200}
              className="h-40 w-auto object-contain opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
