export default function About() {
  return (
    <article id="profile" className="bg-[#141414] section-padding relative mt-[20%] sm:mt-[10%]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-8">
          <i className="fas fa-user fa-3x text-white"></i>
        </div>

        <h2 className="text-center text-white text-3xl mb-12 mt-8">About Me</h2>

        <div className="flex justify-center">
          <div className="w-full md:w-[60%] lg:w-[51%] text-[#D9D9D9] text-[1.2em] font-light leading-[1.8em] tracking-[1px] justify">
            <span>
              Hi, I'm Amir! A full-stack developer specializing in front-end development. I enjoy creating clean, accessible, and user-friendly web applications. My experience extends to back-end development, DevOps, and Linux system administration. Driven by a belief that AI will augment, not replace, developers, I actively use AI-powered tools to enhance my workflow, having spent the last year developing my prompt engineering skills. I am passionate about exploring how this technology will shape the future of user experiences by experimenting with building intelligent, AI-driven features. I’ve also explored software QA and earned an ISTQB certification, which helps me ensure the quality and reliability of my work. When I’m not working on web projects, you’ll find me diving into open-source hardware and IoT or geeking out about cybersecurity. If you share these interests or just want to chat tech, let’s connect!
            </span>
          </div>
        </div>
      </div>

      {/* Triangle Decorator from Legacy */}
      <div className="triangle-decorator text-[#141414]"></div>
    </article>
  );
}
