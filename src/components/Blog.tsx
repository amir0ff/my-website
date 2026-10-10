import mediumFeed from "@/data/medium-posts.json";
import { mediumCardThumbnail } from "@/lib/medium-image";
import { BookOpenIcon, ClockIcon, MediumIcon } from "./icons";

interface Post {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  thumbnail: string;
  categories: string[];
}

const posts = [...(mediumFeed.posts as Post[])]
  .sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  )
  .slice(0, 9);

export default function Blog() {
  const error = posts.length === 0;

  return (
    <article id="blog" className="bg-[#2b2b2b] section-padding relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-8 text-white">
          <MediumIcon size="4em" className="mx-auto" />
        </div>

        <h2 className="text-center text-white text-3xl mb-12 mt-8">My Blog</h2>

        {error && (
          <div className="bg-[#fcf8e3] border-[#faebcc] text-[#8a6d3b] p-4 rounded-md mx-auto max-w-[500px] text-center mb-8">
            Cannot load blog posts! For now, you can read them{" "}
            <a
              href="https://medium.com/@amir0ff"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              here
            </a>
            .
          </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {posts.map((post) => {
            const thumb = mediumCardThumbnail(post.thumbnail, 640);
            return (
              <div key={post.link} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                <div className="bg-[#0d0d0d] rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] overflow-hidden group">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative h-[208px] overflow-hidden bg-[#1a1a1a]">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt=""
                          width={640}
                          height={360}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-opacity duration-350"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-350 flex items-center justify-center">
                        <BookOpenIcon
                          size="4em"
                          className="text-black opacity-0 group-hover:opacity-100 transition-opacity duration-350"
                        />
                      </div>
                    </div>
                    <div className="p-5 relative">
                      <h3 className="text-white font-bold tracking-[1px] normal-case pb-5 border-b border-[#202020] mb-5 leading-[18px] text-base">
                        {post.title}
                      </h3>
                      <div className="text-[#D9D9D9] text-sm text-justify h-[100px] overflow-hidden">
                        {post.description.substring(0, 220)}...
                      </div>
                      <span className="absolute bottom-1 right-2 text-[12px] text-[#959595] flex items-center">
                        <ClockIcon size="0.9em" className="mr-1" />{" "}
                        {new Date(post.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-right mt-8">
          <p className="text-[#959595] text-sm font-roboto">
            Powered by{" "}
            <a
              href="https://medium.com/@amir0ff"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-white font-medium"
            >
              Medium
            </a>
          </p>
        </div>
      </div>

      <div className="triangle-decorator text-[#2b2b2b]" />
    </article>
  );
}
