import React, { useState } from 'react';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate sending email
        setTimeout(() => {
            alert(`Message sent by ${formData.name}`);
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-full w-full bg-slate-50 dark:bg-slate-900 p-6 md:p-12 transition-colors duration-300 flex flex-col items-center">

            {/* Top Section: Email Form */}
            <div className="w-full max-w-4xl bg-[#ffffff] dark:bg-slate-800 rounded-[2rem] shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 md:p-14 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#ffffff] opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-[#ffffff] opacity-10 rounded-full blur-2xl mix-blend-overlay"></div>

                    <div className="relative z-10 text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Drop Us a Message</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group space-y-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none text-lg placeholder:text-slate-400"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="group space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none text-lg placeholder:text-slate-400"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="group space-y-2">
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none resize-none text-lg placeholder:text-slate-400"
                            placeholder="How can we help you today?"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${isSubmitting
                                ? 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] shadow-xl hover:shadow-blue-500/30'
                                } text-white`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-3">
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Message...
                                </span>
                            ) : (
                                <span className="flex items-center gap-3">
                                    Send Message <Send className="w-6 h-6" />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Bottom Section: Info About Us pt-24 space-y-12 */}
            <div className="w-full max-w-5xl mt-24 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                <div className="text-center space-y-6 mb-16">
                    <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        About Track Wise
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-xl leading-relaxed">
                        Track Wise is an intelligent financial tracking platform designed to simplify your expense management.
                        We believe that understanding your financial habits shouldn't be complicated. Our mission is to provide
                        you with clear, insightful, and accessible tools to achieve your financial goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group flex flex-col items-center p-8 bg-[#ffffff] dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Email Us</h4>
                        <p className="text-slate-500 dark:text-slate-200 text-center text-lg">mahesh131005@gmail.com</p>
                    </div>

                    <div className="group flex flex-col items-center p-8 bg-[#ffffff] dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Location</h4>
                        <p className="text-slate-500 dark:text-slate-200 text-center text-lg">Global Digital Platform<br />Available Everywhere</p>
                    </div>

                    <div className="group flex flex-col items-center p-8 bg-[#ffffff] dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Call Us</h4>
                        <p className="text-slate-500 dark:text-slate-200 text-center text-lg">Mon-Fri from 9am to 6pm</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactUs;
