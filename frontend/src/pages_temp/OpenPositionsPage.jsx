import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../../styles/home-page-styles.css";
import rkLogo from "../images/RK Sprinklers.png";
import avatarLogo from "../images/avatar-icon.png";
import { useAuthStore } from "../store/authStore.js";

const jobOpenings = [
  {
    id: 1,
    title: "Sprinkler Installation Technician",
    location: "Sterling Heights, MI",
    type: "Full-Time",
    description: "Join our installation crew to set up residential and commercial sprinkler systems. Requires mechanical aptitude and willingness to work outdoors."
  },
  {
    id: 2,
    title: "Customer Service Representative",
    location: "Remote / On-site",
    type: "Part-Time",
    description: "Help our clients schedule services, answer questions, and provide friendly support. Strong communication skills required."
  },
  {
    id: 3,
    title: "Irrigation System Designer",
    location: "Sterling Heights, MI",
    type: "Full-Time",
    description: "Work with clients to design efficient and sustainable irrigation systems. Experience with CAD or design software is a plus."
  }
];

const OpenPositionsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Mobile Avatar Bar --- */}
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

      {/* --- Top Navbar --- */}
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
            {/* Hamburger Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#c9c9c9">
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z" />
            </svg>
          </button>
        )}

        {isMobile && (
          <a href="tel:5867138783" className="mobile-call-icon" aria-label="Call RK Sprinklers">📞</a>
        )}

        {!isMobile && (
          <div className="top-navbar-right">
            <a href="tel:5867138783" className="phone-link">586-713-8783</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="portal-link">
                <span className="portal-icon">👤</span>
                Welcome, {user?.name}!
              </Link>
            ) : (
              <Link to="/login" className="portal-link">
                <span className="portal-icon">👤</span>
                Customer Portal
              </Link>
            )}
          </div>
        )}
      </header>

      {/* --- Second Navbar --- */}
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
          <li><Link to="/careers">Careers</Link></li>
          <li className="home-li"><Link className="active-link" to="/open-positions">Open Positions</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {isSidebarOpen && <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>}

      {/* --- Page Content --- */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-4xl text-white">
          <h1 className="text-5xl font-extrabold mb-10 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text text-center">
            Open Positions
          </h1>
          <div className="grid gap-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-gray-800 bg-opacity-70 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-green-400">{job.title}</h2>
                <p className="text-gray-300 mb-2">{job.location} • {job.type}</p>
                <p className="text-gray-400 mb-4">{job.description}</p>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  state={{ from: "/dashboard" }}
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default OpenPositionsPage;
