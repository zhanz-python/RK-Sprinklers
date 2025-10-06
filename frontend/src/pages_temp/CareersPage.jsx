import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../../styles/home-page-styles.css";
import rkLogo from "../images/RK Sprinklers.png";
import avatarLogo from "../images/avatar-icon.png";
import gardeningImage from "../../../Images/gardening.jpg";
import { useAuthStore } from "../store/authStore.js";

const CareersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const { isAuthenticated, user } = useAuthStore();

  // Set page title
  useEffect(() => {
    document.title = "RK Sprinklers – Careers";
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Job listings
  const jobs = [
    {
      title: "Sprinkler Maintenance",
      location: "Sterling Heights, MI",
      type: "Full-time",
      description:
        "Flexible availability, 40 hours a week, $20/hour starting salary, goes up with experience. Will be taught and trained.",
      email: "mahumk200@gmail.com",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-green-900">
      {/* Mobile Avatar Bar */}
      <div className="mobile-avatar-bar">
        {isAuthenticated ? (
          <span className="mobile-avatar-link">
            <img src={avatarLogo} alt="Customer Avatar" className="mobile-avatar-img" />
            <span className="ml-2">Welcome, {user?.name}!</span>
          </span>
        ) : (
          <Link to="/login" className="mobile-avatar-link" aria-label="Customer Portal">
            <img src={avatarLogo} alt="Customer Portal Avatar" className="mobile-avatar-img" />
          </Link>
        )}
      </div>

      {/* Top Navbar */}
      <header className="top-navbar">
        <Link to="/" className="logo-link">
          <img src={rkLogo} alt="RK Sprinklers Logo" className="topnav-logo" />
        </Link>

        {isMobile && (
          <button
            id="open-sidebar-button"
            onClick={openSidebar}
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="navbar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#c9c9c9">
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z" />
            </svg>
          </button>
        )}

        {isMobile && (
          <a href="tel:5867138783" className="mobile-call-icon" aria-label="Call RK Sprinklers">
            📞
          </a>
        )}

        {!isMobile && (
          <div className="top-navbar-right">
            <a href="tel:5867138783" className="phone-link">586-713-8783</a>
            {isAuthenticated ? (
              <Link to="/login" className="portal-link"><span className="portal-icon">👤</span> Welcome, {user?.name}!</Link>
            ) : (
              <Link to="/login" className="portal-link"><span className="portal-icon">👤</span> Customer Portal</Link>
            )}
          </div>
        )}
      </header>

      {/* Second Navbar */}
      <nav id="navbar" className={isSidebarOpen ? "show" : ""}>
        <ul>
          {isMobile && (
            <li>
              <button id="close-sidebar-button" onClick={closeSidebar} aria-label="Close sidebar">❌</button>
            </li>
          )}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li className="home-li"><Link className="active-link" to="/careers">Careers</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {isSidebarOpen && <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>}

      {/* Hero / Page Content */}
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-10 w-full">
        <div className="w-full h-64 md:h-96 relative mb-10">
          <img src={gardeningImage} alt="Sprinkler and gardening work" className="w-full h-full object-cover rounded-xl shadow-lg" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-5xl font-extrabold text-white text-center">Careers at RK Sprinklers</h1>
          </div>
        </div>

        <div className="text-center text-white max-w-3xl mb-8">
          <p className="text-lg text-gray-300">
            Join our team of professionals dedicated to providing the best sprinkler and irrigation solutions in the community. We’re always looking for talented, passionate individuals to grow with us.
          </p>
        </div>

        {/* Job Listings */}
        <section className="w-full max-w-4xl mt-8">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Open Positions</h2>
          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <article key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-emerald-400 transition duration-300">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-1">{job.title}</h3>
                  <div className="flex justify-start items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="px-2 py-1 bg-gray-700 rounded-full">{job.location}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded-full">{job.type}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{job.description}</p>
                  <p className="text-emerald-400 font-semibold hover:text-green-300 transition duration-300">
                    Send your resume and cover letter to{" "}
                    <a href={`mailto:${job.email}`} className="underline hover:text-green-200">{job.email}</a>
                  </p>
                </article>
              ))
            ) : (
              <p className="text-gray-400 text-center">No open positions at this time.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;