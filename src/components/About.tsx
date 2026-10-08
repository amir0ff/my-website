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
            <div className="space-y-5">
              <p>
                Hi, I'm Amir! I'm a Senior Frontend and Full-Stack Engineer who builds modern web applications and the infrastructure they run on.
              </p>
              <p>
                With 7+ years of experience shipping production platforms for European startups and high-traffic web applications, I specialize in the React and Next.js ecosystems, combining clean, accessible UI architecture with solid systems thinking.
              </p>
              <p>
                Beyond the browser, my background covers Linux server administration, network observability, and DevOps automation. I actively build and maintain open-source developer tooling and contribute to community projects.
              </p>
              <p>
                I treat modern AI as an operational multiplier: building autonomous agent workflows, leveraging MCP, and integrating intelligent features that eliminate developer boilerplate and accelerate product delivery. With ISTQB certification in software testing, engineering quality and reliability are always baked into everything I build.
              </p>
              <p>
                When I'm not writing code or tuning server telemetry, you'll find me experimenting with open-source hardware, IoT, and cybersecurity. If you want to collaborate, discuss architecture, or chat tech, let's connect!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Triangle Decorator from Legacy */}
      <div className="triangle-decorator text-[#141414]"></div>
    </article>
  );
}
