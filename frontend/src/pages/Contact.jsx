import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.CONTACT.SUBMIT, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Contact Us</h1>
          <p className="text-center text-gray-600 mb-8">
            Have questions? We'd love to hear from you. Send us a message!
          </p>

          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Message</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message (min 10 characters)"
                    className="textarea textarea-bordered w-full h-32"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      {formData.message.length} characters
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>

              {/* Contact Info */}
              <div className="divider my-8">Or reach us directly</div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <span>contact@turfplay.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📞</span>
                  <span>+91-XXXXXXXXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span>TurfPlay HQ, Your City</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

