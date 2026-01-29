"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  fork: boolean;
  clone_url: string;
  created_at: string;
}

export default function Portfolio() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/amir0ff/repos');
        const data = await response.json();
        const filtered = data
          .filter((repo: Repo) => !repo.fork && repo.clone_url !== "https://github.com/amir0ff/amir0ff.git")
          .sort((a: Repo, b: Repo) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRepos(filtered);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };
    fetchRepos();
  }, []);

  const staticProjects = [
    {
      title: "Dropshipping Business",
      description: "I built and manage a Dropshipping business powered by Shopify that provides electronic components and tools for DIY electronics lovers. In there I also showcase things I build with the Arduino open-source hardware platform.",
      link: "https://www.mrrobotelectronics.com/",
      img: "/images/work-10.png"
    },
    {
      title: "Music",
      description: "A portfolio and biography website that exhibits the work and creations of a renowned artist. Built with a full responsive and interactive design.",
      link: "https://www.kherfody.com",
      img: "/images/work-3.png"
    },
    {
      title: "Photography",
      description: "A portfolio and biography website for a professional photographer and artist based on WordPress with optimized mobile display.",
      link: "https://www.naderhawary.com",
      img: "/images/work-7.png"
    },
    {
      title: "Gaming",
      description: "Built in 2007 using a french gaming CMS called 'Nuked-Klan'. Although every CMS comes with a pre-written code, I modified almost 70% of it using just a text editor at the time. It has four themes I designed using Photoshop.",
      link: "/samples/thewowuniverse/",
      img: "/images/work-5.png"
    },
    {
      title: "Education",
      description: "This one was the first serious project made for an educational insitution. It's a content management portal designed for teachers to create workshops for kids in kindergarten and elementary schools.",
      link: "http://www.storykarev.com/",
      img: "/images/work-11.png"
    }
  ];

  return (
    <article id="portfolio" className="bg-[#202020] section-padding relative">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-8 mt-8">
          <i className="fas fa-book fa-3x text-white"></i>
        </div> */}

{/*         <h2 className="text-center text-white text-3xl mb-12">My Portfolio</h2>
 */}        {/* Static Projects */}
        {/* <div className="space-y-16">
          {staticProjects.map((project, idx) => (
            <div key={project.title} className={cn("flex flex-col md:flex-row items-center", idx % 2 !== 0 && "md:flex-row-reverse")}>
              <div className="w-full md:w-1/2 flex justify-center md:justify-end px-8 group">
                <div className="relative w-[190px] h-[190px] rounded-full overflow-hidden shadow-[0_5px_15px_0_rgba(0,0,0,0.6)] border-none">
                  <Image
                    src={project.img}
                    alt={project.title}
                    width={190}
                    height={190}
                    className="grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-[#D9D9D9] text-[1.2em] font-light px-8 mt-6 md:mt-0 justify">
                <h3 className="text-2xl mb-4">
                  <a href={project.link} target="_blank" className="text-white hover:underline">
                    {project.title}
                  </a>
                </h3>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* GitHub Section */}
        <div className="text-center mt-24">
          <Image 
            src="/images/hero-circuit-bg.svg" 
            alt="GitHub" 
            width={800} 
            height={200}
            className="mx-auto mb-8 opacity-80"
          />
          <h2 className="text-3xl mb-12">My GitHub</h2>

          <div className="flex justify-center mb-16 px-4">
              <a 
                href="https://github.com/amir0ff" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0d0d0d] p-4 rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] w-full max-w-[800px] overflow-hidden block hover:opacity-80 transition-opacity"
              >
                  <img 
                    src="https://ghchart.rshah.org/amir0ff" 
                    alt="amir0ff's Github chart" 
                    className="w-full h-auto brightness-90 contrast-110"
                  />
              </a>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            {repos.map((repo) => (
              <div key={repo.id} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                <div className="bg-[#0d0d0d] p-6 rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] repo-card-hover h-full text-left relative overflow-hidden group">
                  <a href={repo.html_url} target="_blank" className="block">
                    <div className="flex justify-between items-start mb-4">
                        <h5 className="text-white font-medium normal-case tracking-normal">{repo.name}</h5>
                        {repo.language && (
                            <span className="text-[10px] text-[#959595] uppercase flex items-center">
                                <span className={cn(
                                    "w-2 h-2 rounded-full mr-1",
                                    repo.language.toLowerCase() === 'javascript' ? "bg-[#f1e05a]" :
                                    repo.language.toLowerCase() === 'typescript' ? "bg-[#2b7489]" :
                                    repo.language.toLowerCase() === 'python' ? "bg-[#3572A5]" : "bg-gray-500"
                                )}></span>
                                {repo.language}
                            </span>
                        )}
                    </div>
                    <p className="text-[#959595] text-sm line-clamp-3">{repo.description}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-right mt-8 flex justify-end">
            <p className="text-[#959595] text-sm font-roboto">Powered by <a href="https://github.com/amir0ff" target="_blank" className="hover:underline text-white">GitHub</a></p>
          </div>
        </div>
      </div>

      {/* Triangle Decorator */}
      <div className="triangle-decorator text-[#202020]"></div>
    </article>
  );
}
