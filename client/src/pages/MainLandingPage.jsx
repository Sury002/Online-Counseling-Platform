import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

export default function MainLandingPage({ user }) {
  if (user?.role === "counselor") return <Navigate to="/dashboard/counselor" />;
  if (user?.role === "client") return <Navigate to="/dashboard/client" />;

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                W
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WellMind
              </span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base text-gray-300 hover:text-indigo-400 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Mental Wellness
                </span>
                <br />
                Made Accessible
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-lg">
                Connect with licensed professionals through secure video
                sessions, real-time messaging, and personalized therapy plans
                tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base border-2 border-indigo-600 text-indigo-400 hover:bg-gray-800 rounded-lg font-medium transition-all text-center"
                >
                  Existing User
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-8 sm:mt-12 lg:mt-0 w-full">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl aspect-[4/3] border-4 sm:border-8 border-gray-800 transform hover:scale-[1.02] transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-6 sm:p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                      Secure Video Therapy
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4">
                      HIPAA-compliant private sessions
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/80 rounded-full text-xs font-medium">
                        End-to-end encrypted
                      </span>
                      <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/80 rounded-full text-xs font-medium">
                        High quality
                      </span>
                      <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/80 rounded-full text-xs font-medium">
                        Easy to use
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                10,000+
              </div>
              <p className="text-gray-300 font-medium">Sessions Completed</p>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                200+
              </div>
              <p className="text-gray-300 font-medium">
                Licensed Professionals
              </p>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                24/7
              </div>
              <p className="text-gray-300 font-medium">Support Available</p>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-indigo-400 mb-2">95%</div>
              <p className="text-gray-300 font-medium">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Therapy Platform
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            All the tools you need for effective mental health support in one
            secure place
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Secure Video Calls",
              description:
                "End-to-end encrypted video sessions with screen sharing options",
            },
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              ),
              title: "Real-Time Messaging",
              description:
                "Instant chat with typing indicators and message history",
            },
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Easy Scheduling",
              description:
                "Book and manage appointments with calendar integration",
            },
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              ),
              title: "Session Notes",
              description: "Counselors create private notes visible to clients",
            },
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              ),
              title: "Secure Payments",
              description: "Safe payment processing for session bookings",
            },
            {
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              ),
              title: "Account Security",
              description: "Reset your password via secure email links",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-14 h-14 mb-6 bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                3-Step Process
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Getting started with WellMind is quick and easy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>

              {/* Steps */}
              {[
                {
                  number: "1",
                  title: "Create Your Profile",
                  description: "Register with your name, email, and password",
                },
                {
                  number: "2",
                  title: "Match With a Counselor",
                  description:
                    "Select from verified professionals and book appointments",
                },
                {
                  number: "3",
                  title: "Begin Your Journey",
                  description:
                    "Attend secure video sessions and message your therapist anytime",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`relative mb-12 md:mb-16 ${
                    index % 2 === 0 ? "md:pr-24" : "md:pl-24"
                  }`}
                >
                  <div className="md:flex items-center">
                    {index % 2 === 0 ? (
                      <>
                        <div className="hidden md:block md:w-1/2 pr-8 text-right">
                          <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                        <div className="flex justify-center md:justify-start md:w-1/2">
                          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                            {step.number}
                          </div>
                        </div>
                        <div className="md:hidden mt-4 text-center">
                          <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center md:justify-end md:w-1/2">
                          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                            {step.number}
                          </div>
                        </div>
                        <div className="hidden md:block md:w-1/2 pl-8">
                          <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                        <div className="md:hidden mt-4 text-center">
                          <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Clients & Professionals
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hear from those who've experienced WellMind firsthand
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Sarah J.",
              role: "Client",
              quote:
                "WellMind changed my life. After struggling to find the right therapist locally, I found the perfect match here. The convenience and quality of care are unmatched.",
              avatar: "SJ",
            },
            {
              name: "Dr. Michael T.",
              role: "Counselor",
              quote:
                "The platform provides all the tools I need to effectively manage my practice online. The scheduling and documentation features save me hours each week.",
              avatar: "MT",
            },
            {
              name: "Alex M.",
              role: "Client",
              quote:
                "I was hesitant about online therapy, but WellMind made it so easy. My therapist truly understands me, and I can schedule sessions between classes.",
              avatar: "AM",
            },
            {
              name: "Dr. Priya K.",
              role: "Counselor",
              quote:
                "WellMind's platform allows me to focus on my clients without administrative hassles. The secure tools make remote therapy just as effective as in-person.",
              avatar: "PK",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 font-semibold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about WellMind
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How do I choose a counselor?",
                answer:
                  "After logging in, you can browse our directory of book appointment, and select the counselor that best fits your needs.",
              },
              {
                question: "Is my information kept confidential?",
                answer:
                  "Absolutely. We use end-to-end encryption for all communications and adhere to strict HIPAA compliance standards. Your sessions and personal information are completely confidential, just like in traditional therapy settings.",
              },
              {
                question: "What if I need to cancel sessions",
                answer:
                  "Yes, you can cancel appointments through your dashboard. Please check your counselor's cancellation policy for any specific requirements.",
              },
              {
                question: "How does payment work?",
                answer:
                  "Payment is required before accessing chat or video features. After successful payment, you'll have full access to your scheduled session.",
              },
              {
                question: "What if I forget my password?",
                answer:
                  "You can reset your password using the 'Forgot Password' link on the login page. We'll send a secure reset link to your email.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-${index}`}
                >
                  <h3 className="text-lg font-semibold flex items-center justify-between">
                    <span>{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-indigo-400 transition-transform duration-200 ${
                        activeIndex === index ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </h3>
                </button>
                <div
                  id={`faq-${index}`}
                  className={`px-6 pb-6 pt-0 transition-all duration-300 overflow-hidden ${
                    activeIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-400">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5 pattern-dots pattern-gray-400 pattern-bg-transparent pattern-size-6 pattern-opacity-100"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Prioritize Your Mental Health?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take the first step toward better well-being today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white hover:bg-gray-100 text-indigo-600 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 border-2 border-white text-white hover:bg-white/10 rounded-lg font-medium transition-all text-center"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand Column */}
            <div className="sm:col-span-2 md:col-span-1">
              {" "}
             
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  W
                </div>
                <span className="text-2xl font-bold text-white">WellMind</span>
              </div>
              
              <p className="text-gray-400 text-sm sm:text-base">
                Professional online counseling platform for mental health and
                wellness.
              </p>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="hover:text-white transition">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/crisis" className="hover:text-white transition">
                    Crisis Resources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/facebook" className="hover:text-white transition">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link to="/twitter" className="hover:text-white transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link to="/instagram" className="hover:text-white transition">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} WellMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
