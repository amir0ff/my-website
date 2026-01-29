"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <article 
      id="home" 
      className="relative w-full h-screen min-h-[700px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/images/background6.jpg")' }}
    >
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8">
            <Image
              src="/images/amir_glasses.jpg"
              alt="Me!"
              width={230}
              height={230}
              className="img-circle img-avatar object-cover"
              priority
            />
          </div>
          <h1 className="text-white text-[3em] sm:text-[4.8em] font-extrabold font-open-sans leading-tight [text-shadow:0px_0px_1px_#0D0D0D]">
            Senior Front-End <br />
            Developer
          </h1>
        </div>
      </div>
      
      {/* Triangle Decorator */}
      <div className="triangle-decorator text-[#141414]"></div>
    </article>
  );
}
