import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../../styles/home-page-styles.css";
import rkLogo from "../images/RK Sprinklers.png";
import avatarLogo from "../images/avatar-icon.png";
import { useAuthStore } from "../store/authStore.js";

const AboutUsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const { isAuthenticated, user } = useAuthStore();

  
  useEffect(() => {
    document.title = "RK Sprinklers – About Us"; // <-- Add this line
  }, []);

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
            {/* Hamburger Menu Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#c9c9c9"
            >
              <path d="M165.13-254.62q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.86q7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.87q-7.22 7.12-17.9 7.12H165.13Zm0-200.25q-10.68 0-17.9-7.27-7.23-7.26-7.23-17.99 0-10.74 7.23-17.87 7.22-7.13 17.9-7.13h629.74q10.68 0 17.9 7.27 7.23 7.26 7.23 17.99 0 10.74-7.23 17.87-7.22 7.13-17.9 7.13H165.13Zm0-200.26q-10.68 0-17.9-7.26-7.23-7.26-7.23-18t7.23-17.87q7.22-7.12 17.9-7.12h629.74q10.68 0 17.9 7.26 7.23 7.26 7.23 18t-7.23 17.86q-7.22 7.13-17.9 7.13H165.13Z" />
            </svg>
          </button>
        )}

        {isMobile && (
          <a
            href="tel:5867138783"
            className="mobile-call-icon"
            aria-label="Call RK Sprinklers"
          >
            📞
          </a>
        )}

        {!isMobile && (
          <div className="top-navbar-right">
            <a href="tel:5867138783" className="phone-link">
              586-713-8783
            </a>

            {isAuthenticated ? (
              <Link to="/login" className="portal-link">
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
              <button
                id="close-sidebar-button"
                onClick={closeSidebar}
                aria-label="Close sidebar"
              >
                {/* Close Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#c9c9c9"
                >
                  <path d="m480-444.62-209.69 209.7q-7.23 7.23-17.5 7.42-10.27.19-17.89-7.42-7.61-7.62-7.61-17.7 0-10.07 7.61-17.69L444.62-480l-209.7-209.69q-7.23-7.23-7.42-17.5-.19-10.27 7.42-17.89 7.62-7.61 17.7-7.61 10.07 0 17.69 7.61L480-515.38l209.69-209.7q7.23-7.23 17.5-7.42 10.27-.19 17.89 7.42 7.61 7.62 7.61 17.7 0 10.07-7.61 17.69L515.38-480l209.7 209.69q7.23 7.23 7.42 17.5.19 10.27-7.42 17.89-7.62 7.61-17.7 7.61-10.07 0-17.69-7.61L480-444.62Z" />
                </svg>
              </button>
            </li>
          )}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="home-li">
            <Link className="active-link" to="/about">
              About
            </Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/careers">Careers</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      {isSidebarOpen && (
        <div id="overlay" onClick={closeSidebar} aria-hidden="true"></div>
      )}

      {/* --- Page Content --- */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            About Us
          </h1>

          <section className="mb-10">
            <p className="text-lg text-gray-300 mb-4">
              RK Sprinklers is a family-owned and operated business that has been
              providing reliable sprinkler and winterization services for years.
              We are proud of our fair pricing, timely service, and excellent
              customer care.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Mission Statement</h2>
            <p className="text-gray-300">
              Our mission is to provide customers with high-quality sprinkler and
              winterization services. We are committed to ensuring satisfaction,
              building lasting relationships, and conserving water while keeping
              lawns green and healthy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-400">Contact Information</h2>
            <p className="text-gray-300">
              Call or text us at{" "}
              <a href="tel:5867138783" className="underline text-green-400">
                586-713-8783
              </a>{" "}
              or visit our{" "}
              <Link to="/contact" className="underline text-green-400">
                Contact Page
              </Link>{" "}
              to inquire about our services and pricing.
            </p>
          </section>
        </div>
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
