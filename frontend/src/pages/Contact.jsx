import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from 'motion/react';
import { CalendarClock, Headset, Mail, MapPin, MessageSquareMore, Phone, SendHorizonal } from 'lucide-react';
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(API_PATHS.CONTACT.SUBMIT, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit contact");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
              Contact team
            </span>
            <h1 className="mt-5 text-4xl font-semibold text-[var(--app-text)] sm:text-5xl">Get in touch</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Questions, support requests, partnerships, or venue onboarding. We’ll keep the response experience as smooth as the product.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="surface-card-strong p-6 sm:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--app-text)]">Send us a message</h2>
                    <p className="mt-2 text-sm text-muted">Share the details and we’ll route it to the right team.</p>
                  </div>
                  <div className="brand-gradient hidden h-12 w-12 items-center justify-center rounded-2xl text-white sm:flex">
                    <MessageSquareMore size={20} />
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="box-border w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="box-border w-full rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--app-text)]">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message (min 10 characters)"
                      className="box-border h-32 w-full resize-none rounded-2xl border border-[var(--app-border)] bg-white/10 px-4 py-3 text-[var(--app-text)] placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                    <div className="mt-2 text-sm text-muted">
                      {formData.message.length} characters
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendHorizonal size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {[
                { icon: Mail, title: 'Email', text: 'contact@turfplay.com' },
                { icon: Phone, title: 'Phone', text: '+91 90000 00000' },
                { icon: MapPin, title: 'Address', text: 'TurfPlay HQ, India' },
                { icon: CalendarClock, title: 'Hours', text: 'Support available every day' },
                { icon: Headset, title: 'Response', text: 'Usually within a few business hours' },
              ].map((item) => (
                <div key={item.title} className="surface-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--app-text)]">{item.title}</div>
                      <div className="text-sm text-muted">{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
      </div>
    </div>
  );
};

export default Contact;
