"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { cn } from "@/lib/utils";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.message) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("sending");

    // Replace with your actual IDs from EmailJS
    emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', 
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', 
        {
            sender: formData.name,
            email: formData.email,
            message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
    )
    .then(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      setStatus("error");
    });
  };

  return (
    <article id="contact" className="bg-[#EDEDED] section-padding text-[#333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-8">
          <i className="fas fa-envelope fa-3x"></i>
        </div>

        <h2 className="text-center text-3xl mb-12">Contact Me</h2>

        {status === "success" ? (
            <div className="max-w-[500px] mx-auto text-center">
                <div className="bg-[#dff0d8] border-[#d6e9c6] text-[#3c763d] p-4 rounded-md mb-8">
                    Message sent! I'll get back to you shortly.
                </div>
            </div>
        ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-gray-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">Please enter your name</div>}
                    </div>
                    <div className="flex flex-col items-center">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-gray-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">Please enter a valid email address</div>}
                    </div>
                    <div className="flex flex-col items-center">
                        <textarea
                            placeholder="Message"
                            className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base h-[200px] focus:outline-none focus:border-gray-500"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        {errors.message && <div className="text-red-600 text-sm mt-1">Please enter a message</div>}
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    {/* reCAPTCHA placeholder - Would need actual implementation for functional site */}
                    <div className="bg-gray-200 p-2 text-xs text-gray-500">
                        reCAPTCHA verification placeholder
                    </div>
                    
                    <div className="flex space-x-4 w-full md:w-1/2 justify-center">
                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="bg-gray-800 text-white px-8 py-2 rounded hover:bg-black transition-colors min-w-[100px] flex items-center justify-center"
                        >
                            {status === "sending" ? <i className="fas fa-sync-alt fa-spin mr-2"></i> : "Send"}
                        </button>
                        
                        <a 
                            href="https://keybase.io/amir0ff" 
                            target="_blank"
                            className="bg-[#f0ad4e] text-white px-4 py-2 rounded hover:bg-[#ec971f] transition-colors"
                        >
                            PGP <i className="fas fa-key ml-1"></i>
                        </a>
                    </div>
                </div>
                
                {status === "error" && (
                    <div className="bg-[#f2dede] border-[#ebccd1] text-[#a94442] p-4 rounded-md mt-8 text-center">
                        Failed to send message. Please try again.
                    </div>
                )}
            </form>
        )}

        {/* Social Links */}
        <div id="social" className="mt-16">
            <div className="flex justify-center space-x-6">
                <a href="https://www.linkedin.com/in/amir0ff" target="_blank" className="text-gray-600 hover:text-black transition-colors grayscale hover:grayscale-0">
                    <i className="fab fa-linkedin fa-2x"></i>
                </a>
                <a href="https://www.youtube.com/@amir0ff" target="_blank" className="text-gray-600 hover:text-black transition-colors grayscale hover:grayscale-0">
                    <i className="fab fa-youtube fa-2x"></i>
                </a>
                <a href="https://github.com/amir0ff" target="_blank" className="text-gray-600 hover:text-black transition-colors grayscale hover:grayscale-0">
                    <i className="fab fa-github fa-2x"></i>
                </a>
            </div>
        </div>
      </div>
    </article>
  );
}
