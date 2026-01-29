"use client";

import { useEffect, useState } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", to: "profile" },
    { name: "Portfolio", to: "portfolio" },
    { name: "Blog", to: "blog" },
    { name: "Resume", to: "https://www.linkedin.com/in/amir0ff", isExternal: true },
    { name: "Contact", to: "contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-open-sans min-w-[300px]",
        isScrolled 
          ? "pt-0 bg-[#0D0D0D] border-b border-[#0A0A0A] shadow-[0px_1px_2px_#020202]" 
          : "pt-[30px] bg-transparent border-b-transparent shadow-none"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-[70px]">
        <div className="flex items-center">
            <button 
                className="text-[2.5em] font-damion text-white shadow-[#0D0D0D] [text-shadow:1px_2px_1px_var(--tw-shadow-color)] cursor-pointer"
                onClick={() => scroll.scrollToTop()}
            >
                AmirOff
            </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            link.isExternal ? (
                <a
                    key={link.name}
                    href={link.to}
                    target="_blank"
                    className="px-[2px] mx-[13px] text-[1.1em] font-medium font-roboto uppercase text-white hover:text-white relative group"
                >
                    {link.name}
                </a>
            ) : (
                <ScrollLink
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="px-[2px] mx-[13px] text-[1.1em] font-medium font-roboto uppercase text-white hover:text-white relative group cursor-pointer"
                >
                    {link.name}
                    <span className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-center" />
                </ScrollLink>
            )
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={cn("fas", isOpen ? "fa-times" : "fa-bars", "fa-lg")} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-[#0D0D0D] transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[500px] border-b border-[#0A0A0A]" : "max-h-0"
      )}>
        <ul className="py-4">
          {navLinks.map((link) => (
            <li key={link.name} className="px-6 py-2">
              {link.isExternal ? (
                <a
                  href={link.to}
                  target="_blank"
                  className="text-white uppercase font-roboto text-lg block"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <ScrollLink
                  to={link.to}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="text-white uppercase font-roboto text-lg block cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </ScrollLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
