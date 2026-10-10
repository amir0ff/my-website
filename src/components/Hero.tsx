export default function Hero() {
  return (
    <article
      id="home"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      <picture className="absolute inset-0">
        <source
          srcSet="/images/background6_enhanced.webp"
          type="image/webp"
        />
        <img
          src="/images/background6_enhanced.jpg"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8))",
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8">
            <picture>
              <source srcSet="/images/amir_glasses.webp" type="image/webp" />
              <img
                src="/images/amir_glasses-460.jpg"
                alt="Portrait of Amir Off"
                width={230}
                height={230}
                decoding="async"
                className="img-circle img-avatar object-cover"
              />
            </picture>
          </div>
          <h1 className="text-white text-[3em] sm:text-[4.8em] font-bold font-open-sans leading-tight [text-shadow:0px_0px_1px_#0D0D0D]">
            Senior Frontend & <br />
            Full-Stack Engineer
          </h1>
        </div>
      </div>

      <div className="triangle-decorator text-[#141414]" />
    </article>
  );
}
