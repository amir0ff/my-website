"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { cn } from "@/lib/utils";

interface Post {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  thumbnail: string;
  content: string;
  categories: string[];
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const extractImage = (description: string) => {
      const match = description.match(/<img[^>]+src="([^">]+)"/);
      return match ? match[1] : "";
    };

    const fetchPosts = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RSS2JSON_API_KEY || '';
        const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@amir0ff&api_key=${apiKey}&order_by=pubDate&order_dir=asc&count=14`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data || !data.items) {
          throw new Error("Invalid response from RSS API");
        }

        const filtered = data.items.filter((item: Post) => item.categories.length > 0);
        
        const processed = filtered.map((item: Post) => ({
          ...item,
          thumbnail: item.thumbnail || extractImage(item.description) || extractImage(item.content)
        }));

        setPosts(processed);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(true);
      }
    };
    fetchPosts();
  }, []);

  return (
    <article id="blog" className="bg-[#2b2b2b] section-padding relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-8">
          <i className="fab fa-medium fa-4x text-white"></i>
        </div>

        <h2 className="text-center text-white text-3xl mb-12 mt-8">My Blog</h2>

        {error && (
            <div className="bg-[#fcf8e3] border-[#faebcc] text-[#8a6d3b] p-4 rounded-md mx-auto max-w-[500px] text-center mb-8">
                Cannot fetch blog posts! For now, you can read them <a href="https://medium.com/@amir0ff" target="_blank" className="font-bold underline">here</a>.
            </div>
        )}

        <div className="flex flex-wrap -mx-4">
          {posts.map((post) => (
            <div key={post.title} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-[#0d0d0d] rounded-md shadow-[0_3px_13px_0_rgba(0,0,0,0.6)] overflow-hidden group">
                <a href={post.link} target="_blank" className="block">
                  <div 
                    className="h-[208px] bg-cover bg-center relative transition-opacity duration-350"
                    style={{ backgroundImage: `url(${post.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-350 flex items-center justify-center">
                        <i className="fa fa-book-open fa-4x text-black opacity-0 group-hover:opacity-100 transition-opacity duration-350"></i>
                    </div>
                  </div>
                  <div className="p-5 relative">
                    <h5 className="text-white font-bold tracking-[1px] normal-case pb-5 border-b border-[#202020] mb-5 leading-[18px]">
                      {post.title}
                    </h5>
                    <div className="text-[#D9D9D9] text-sm text-justify h-[100px] overflow-hidden">
                        {post.content.replace(/(<[^>]+>)/ig, "").substring(0, 220)}...
                    </div>
                    <span className="absolute bottom-1 right-2 text-[12px] text-[#959595] flex items-center">
                        <i className="fas fa-clock mr-1"></i> {moment(post.pubDate).format('MMM D, YYYY')}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-right mt-8">
            <p className="text-[#959595] text-sm font-roboto">Powered by <a href="https://medium.com/@amir0ff" target="_blank" className="hover:underline text-white font-medium">Medium</a></p>
        </div>
      </div>

      {/* Triangle Decorator */}
      <div className="triangle-decorator text-[#2b2b2b]"></div>
    </article>
  );
}
