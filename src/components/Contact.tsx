import { useState, useRef, lazy, Suspense } from "react";
import type ReCAPTCHAType from "react-google-recaptcha";
import { cn } from "@/lib/utils";
import {
  EnvelopeIcon,
  GitHubIcon,
  KeyIcon,
  LinkedInIcon,
  SpinnerIcon,
  YouTubeIcon,
} from "./icons";

const ReCAPTCHA = lazy(() => import("react-google-recaptcha"));

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHAType>(null);
  const captchaConfigured = Boolean(RECAPTCHA_SITE_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!captchaConfigured) {
      alert("Contact form is not configured. Add VITE_RECAPTCHA_SITE_KEY to your .env file.");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    setStatus("sending");

    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.default.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
        {
          sender: formData.name,
          email: formData.email,
          message: formData.message,
          "g-recaptcha-response": captchaToken,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
      );
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  return (
    <article className="bg-[#EDEDED] section-padding text-[#333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-8">
          <EnvelopeIcon size="3em" className="mx-auto" />
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
                  className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-gray-500 bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <div className="text-red-600 text-sm mt-1">Please enter your name</div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-gray-500 bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <div className="text-red-600 text-sm mt-1">
                    Please enter a valid email address
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <textarea
                  placeholder="Message"
                  className="w-full md:w-1/2 p-3 border border-gray-300 rounded text-base h-[200px] focus:outline-none focus:border-gray-500 bg-white"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {errors.message && (
                  <div className="text-red-600 text-sm mt-1">Please enter a message</div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 mb-6">
              {captchaConfigured ? (
                <Suspense fallback={<div className="h-[78px] w-[304px]" aria-hidden="true" />}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </Suspense>
              ) : (
                <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-3 rounded-md text-sm text-center max-w-[400px]">
                  reCAPTCHA is not configured. Copy <code>.env.example</code> to{" "}
                  <code>.env</code> and set <code>VITE_RECAPTCHA_SITE_KEY</code>.
                </div>
              )}

              <div className="flex space-x-4 w-full md:w-1/2 justify-center">
                <button
                  type="submit"
                  disabled={status === "sending" || !captchaConfigured || !captchaToken}
                  className={cn(
                    "bg-gray-800 text-white px-8 py-2 rounded transition-colors min-w-[100px] inline-flex items-center justify-center gap-2 text-base",
                    status === "sending" || !captchaConfigured || !captchaToken
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black cursor-pointer",
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <SpinnerIcon size={18} className="shrink-0 animate-spin" />
                      <span>Send</span>
                    </>
                  ) : (
                    "Send"
                  )}
                </button>

                <a
                  href="https://keybase.io/amir0ff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f0ad4e] text-[#1a1a1a] px-4 py-2 rounded hover:bg-[#ec971f] transition-colors inline-flex items-center justify-center gap-2 text-base font-medium"
                >
                  PGP
                  <KeyIcon size={18} className="shrink-0" />
                </a>
              </div>
            </div>

            {status === "error" && (
              <div className="bg-[#f2dede] border-[#ebccd1] text-[#a94442] p-4 rounded-md mt-8 text-center max-w-[500px] mx-auto">
                Failed to send message. Please try again.
              </div>
            )}
          </form>
        )}

        <div id="social" className="mt-16">
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.linkedin.com/in/amir0ff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-700 hover:text-black transition-colors"
            >
              <LinkedInIcon size="2em" />
            </a>
            <a
              href="https://www.youtube.com/@amir0ff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-gray-700 hover:text-black transition-colors"
            >
              <YouTubeIcon size="2em" />
            </a>
            <a
              href="https://github.com/amir0ff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-700 hover:text-black transition-colors"
            >
              <GitHubIcon size="2em" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
