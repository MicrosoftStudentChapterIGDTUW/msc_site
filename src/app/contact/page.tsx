"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, X } from "lucide-react";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import PillNav from '@/components/PillNav';
import Aurora from '@/components/Aurora';


export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            alert("Please fill all required fields.");
            return;
        }
        setIsSubmitting(true);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_INBOX!,
                {
                    title: "Contact Form Message",
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_AUTOREPLY!,
                {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            setShowSuccess(true);
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("EmailJS Error Details:", error);
            alert("Something went wrong. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Background SVG */}
            <div className="background-with-svg" id="top"></div>

            {/* Aurora Background */}
            <Aurora
                colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
                blend={1}
                amplitude={1.0}
                speed={1}
            />

            {/* Sticky Navbar */}
            <PillNav
                logo="/logo.png"
                logoAlt="MSC Logo"
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'About us', href: '/#about' },
                    { label: 'Events', href: '/events' },
                    { label: 'Blogs', href: '/#blogs' },
                    { label: 'Team', href: '/team' },
                    { label: 'Contact us', href: '/contact' },
                    { label: 'FAQ', href: '/#faq' },
                ]}
                activeHref="/contact"
                baseColor="#0066cc"
                pillColor="#0066cc"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#ffffff"
            />

            <div id="contact" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-36 text-white">
                {/* Responsive Contact Card */}
                <div className="relative z-10 w-full max-w-6xl bg-gradient-to-br from-[#0f0f1f]/80 via-[#0a0a14]/70 to-[#1a0033]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full rounded-md bg-[#2b2b2b]/70 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full rounded-md bg-[#2b2b2b]/70 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-md bg-[#2b2b2b]/70 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full h-32 resize-none rounded-md bg-[#2b2b2b]/70 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Message"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-700 to-indigo-500 hover:opacity-90 rounded-md px-6 sm:px-8 py-2 font-semibold flex items-center justify-center gap-3 disabled:opacity-50 text-sm sm:text-base"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Info */}
                    <div className="flex flex-col justify-start mt-6 md:mt-0 space-y-6">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                            Contact <span className="text-indigo-400">Us</span>
                        </h2>
                        <p className="text-gray-300 text-base sm:text-lg md:text-xl">
                            Send us a message and we’ll respond soon. <br />
                            Get all your queries resolved here!
                        </p>

                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center space-x-3 text-base sm:text-lg">
                                <FaLinkedin className="text-indigo-400 w-6 h-6" />
                                <a
                                    href="https://www.linkedin.com/company/microsoft-student-chapter-igdtuw/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-300 transition-colors"
                                >
                                    LinkedIn
                                </a>
                            </div>

                            <div className="flex items-center space-x-3 text-base sm:text-lg">
                                <FaTwitter className="text-indigo-400 w-6 h-6" />
                                <a
                                    href="https://x.com/IgdtuwMsc/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-300 transition-colors"
                                >
                                    Twitter
                                </a>
                            </div>

                            <div className="flex items-center space-x-3 text-base sm:text-lg">
                                <FaInstagram className="text-indigo-400 w-6 h-6" />
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-300 transition-colors"
                                >
                                    Instagram
                                </a>
                            </div>

                            <div className="flex items-center space-x-3 text-base sm:text-lg">
                                <MapPin className="text-indigo-400 w-6 h-6" />
                                <span>IGDTUW, Kashmere Gate, Delhi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[#1a0b33]/90 border border-purple-400/30 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full relative">
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-4 right-4 text-purple-300/60 hover:text-purple-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300" />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-purple-100">
                                Message Sent!
                            </h3>
                            <p className="text-purple-200/70 mb-6 text-sm sm:text-base">
                                Thank you for reaching out! We’ll get back to you soon.
                            </p>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="bg-gradient-to-r from-blue-600 to-blue-900 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-violet-600 transition-all duration-300 text-sm sm:text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

